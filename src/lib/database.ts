import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/utils/supabase/admin";

type Data = Record<string, any>;
class Operation {
  constructor(readonly kind: string, readonly value?: unknown) {}
}
export const FieldValue = {
  serverTimestamp: () => new Operation("timestamp"),
  increment: (value: number) => new Operation("increment", value),
  arrayUnion: (...value: unknown[]) => new Operation("union", value),
  arrayRemove: (...value: unknown[]) => new Operation("remove", value),
};
// Every node is encoded, so user JSON can never impersonate an operation.
function encode(value: any): any {
  if (value instanceof Operation) return { kind: value.kind, value: value.value };
  if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
    return { kind: "object", entries: Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => [k, encode(v)])) };
  }
  return { kind: "value", value: value instanceof Date ? value.toISOString() : value };
}
type Write = { collection: string; id: string; mode: string; patch?: any; merge?: boolean };
type Read = { collection: string; id: string; version: number | null };
class Snapshot {
  readonly exists: boolean;
  readonly id: string;
  constructor(readonly ref: Document, private row: { data: Data; version: number } | null) {
    this.exists = !!row; this.id = ref.id;
  }
  data(): Data | undefined { return this.row?.data; }
  get version() { return this.row?.version ?? null; }
}
class Document {
  constructor(readonly db: Database, readonly collection: string, readonly id: string) {
    if (!collection || !id || collection.includes("/") || id.includes("/")) throw new Error("Invalid document path");
  }
  async get() {
    const { data, error } = await createAdminClient().from("app_documents").select("data,version").eq("collection", this.collection).eq("id", this.id).maybeSingle();
    if (error) throw error;
    return new Snapshot(this, data);
  }
  set(data: Data, options?: { merge?: boolean }) { return this.db.commit([], [this.write("set", data, !!options?.merge)]); }
  update(data: Data) { return this.db.commit([], [this.write("update", data, true)]); }
  delete() { return this.db.commit([], [this.write("delete")]); }
  write(mode: string, data?: Data, merge?: boolean): Write { return { collection: this.collection, id: this.id, mode, patch: data ? encode(data) : undefined, merge }; }
}
class Collection {
  constructor(private db: Database, private name: string, private filters: [string, unknown][] = [], private count = Infinity) {}
  doc(id = randomUUID()) { return new Document(this.db, this.name, id); }
  async add(data: Data) { const ref = this.doc(); await ref.set(data); return ref; }
  where(field: string, operator: string, value: unknown) {
    if (operator !== "==" || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field)) throw new Error("Unsupported query");
    return new Collection(this.db, this.name, [...this.filters, [field, value]], this.count);
  }
  limit(count: number) { return new Collection(this.db, this.name, this.filters, count); }
  async get() {
    const docs: Snapshot[] = [];
    while (docs.length < this.count) {
      const size = Math.min(500, this.count - docs.length);
      let query = createAdminClient().from("app_documents").select("id,data,version").eq("collection", this.name).order("id");
      for (const [field, value] of this.filters) query = query.contains("data", { [field]: value });
      const { data, error } = await query.range(docs.length, docs.length + size - 1);
      if (error) throw error;
      for (const row of data || []) docs.push(new Snapshot(this.doc(row.id), row));
      if (!data?.length) break;
    }
    return { docs, empty: docs.length === 0, size: docs.length };
  }
}
class Transaction {
  readonly reads = new Map<string, Read>();
  readonly writes: Write[] = [];
  async get(ref: Document) {
    if (this.writes.length) throw new Error("Read documents before writing in a transaction");
    const snap = await ref.get();
    this.reads.set(`${ref.collection}/${ref.id}`, { collection: ref.collection, id: ref.id, version: snap.version });
    return snap;
  }
  set(ref: Document, data: Data, options?: { merge?: boolean }) { this.writes.push(ref.write("set", data, !!options?.merge)); return this; }
  update(ref: Document, data: Data) { this.writes.push(ref.write("update", data, true)); return this; }
  delete(ref: Document) { this.writes.push(ref.write("delete")); return this; }
}
class Database {
  doc(path: string) { const parts = path.split("/"); if (parts.length !== 2) throw new Error("Invalid document path"); return new Document(this, parts[0], parts[1]); }
  collection(name: string) { return new Collection(this, name); }
  async commit(reads: Read[], writes: Write[]) {
    if (!writes.length) return;
    const { error } = await createAdminClient().rpc("vacademy_commit", { p_reads: reads, p_writes: writes });
    if (error) throw error;
  }
  async runTransaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      const tx = new Transaction();
      const result = await callback(tx);
      try { await this.commit([...tx.reads.values()], tx.writes); return result; }
      catch (error) { if ((error as { code?: string }).code !== "40001" || attempt >= 4) throw error; }
    }
  }
  batch() {
    const tx = new Transaction();
    return Object.assign(tx, { commit: () => this.commit([], tx.writes) });
  }
}
const db = new Database();
export function getDb() { return db; }
