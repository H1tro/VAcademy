const fs=require('fs'), assert=require('node:assert/strict'), Module=require('node:module'),ts=require('typescript');
const {PGlite}=require('@electric-sql/pglite');
const pg=new PGlite();
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
let calls=0,conflict=false;
const client={
 from:()=>{let collection,id,filters=[],start=0,end=499;
 const query={select:()=>query,eq:(key,value)=>{if(key==='collection')collection=value;else id=value;return query;},order:()=>query,
 contains:(_,value)=>{filters.push(value);return query;},range:(a,b)=>{start=a;end=b;return query;},
 maybeSingle:async()=>{const r=await pg.query('select data,version from public.app_documents where collection=$1 and id=$2',[collection,id]);return {data:r.rows[0]||null,error:null};},
 then:(resolve,reject)=>{calls++;const args=[collection];let sql='select id,data,version from public.app_documents where collection=$1';
 for(const filter of filters){args.push(JSON.stringify(filter));sql+=' and data @> $'+args.length+'::jsonb';}
 args.push(end-start+1,start);sql+=' order by id limit $'+(args.length-1)+' offset $'+args.length;
 return pg.query(sql,args).then(r=>({data:r.rows,error:null})).then(resolve,reject);}};return query;},
 rpc:async(_,args)=>{try{
 if(conflict){conflict=false;await pg.query("update public.app_documents set version=version+1 where collection='users'");}
 await pg.query('select public.vacademy_commit($1::jsonb,$2::jsonb)',[JSON.stringify(args.p_reads),JSON.stringify(args.p_writes)]);return {error:null};
 }catch(error){return {error};}}
};
const original=Module._load;Module._load=function(name,...args){if(name==='@/utils/supabase/admin')return {createAdminClient:()=>client};return original.call(this,name,...args);};
const {getDb,FieldValue}=require('../src/lib/database.ts');const db=getDb();
const uid='00000000-0000-4000-8000-000000000001';
const {LEGAL_VERSION}=require('../src/lib/legal-config.ts');
const ack={version:LEGAL_VERSION,termsAccepted:true,privacyRead:true,ageRange:'13-17',guardianPermission:true};
(async()=>{
 await pg.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);');
 await pg.exec(fs.readFileSync('supabase/migrations/202610100001_vacademy.sql','utf8').replace(/^\uFEFF/,''));
 await assert.rejects(pg.query('insert into auth.users values($1,$2,$3)',[uid,'test@example.org',JSON.stringify({legalAcknowledgement:{...ack,ageRange:'under13'}})]),/acknowledgement/);
 await pg.query('insert into auth.users values($1,$2,$3)',[uid,'test@example.org',JSON.stringify({displayName:'Test',role:'admin',legalAcknowledgement:ack})]);
 for (const invalid of [{...ack,guardianPermission:false},{...ack,termsAccepted:'true'},{...ack,version:'old'}]) await assert.rejects(pg.query('insert into auth.users values($1,$2,$3)',['00000000-0000-4000-8000-000000000002','blocked@example.org',JSON.stringify({legalAcknowledgement:invalid})]),/acknowledgement/);
 const adult='00000000-0000-4000-8000-000000000003';await pg.query('insert into auth.users values($1,$2,$3)',[adult,'adult@example.org',JSON.stringify({legalAcknowledgement:{...ack,ageRange:'18+',guardianPermission:false}})]);assert.equal((await db.doc('users/'+adult).get()).data().legalAcknowledgement.guardianPermission,false);await pg.query('delete from auth.users where id=$1',[adult]);
 const ref=db.doc('users/'+uid);let user=(await ref.get()).data();assert.equal(user.role,'student');assert.equal(user.legalAcknowledgement.ageRange,'13-17');assert.ok(user.legalAcknowledgement.acceptedAt);
 await pg.exec('set role authenticated;');await assert.rejects(pg.query('select * from public.app_documents'),/permission denied/);await assert.rejects(pg.query("select public.vacademy_commit('[]','[]')"),/permission denied/);await pg.exec('reset role;set role anon;');await assert.rejects(pg.query('select * from public.app_documents'),/permission denied/);await pg.exec('reset role;set role service_role;');
 await ref.set({nested:{first:1},array:['a'],literal:{kind:'increment',value:100}}, {merge:true});
 await ref.update({nested:{second:2},array:FieldValue.arrayUnion('a','b'),totalScore:FieldValue.increment(3),updatedAt:FieldValue.serverTimestamp()});
 user=(await ref.get()).data();assert.deepEqual(user.nested,{first:1,second:2});assert.deepEqual(user.array,['a','b']);assert.deepEqual(user.literal,{kind:'increment',value:100});assert.equal(user.totalScore,3);assert.ok(user.updatedAt);
 await ref.update({array:FieldValue.arrayRemove('a')});assert.deepEqual((await ref.get()).data().array,['b']);
 conflict=true;let attempts=0;
 await db.runTransaction(async tx=>{attempts++;await tx.get(ref);tx.set(ref,{tasksSolved:FieldValue.increment(1)},{merge:true});});assert.equal(attempts,2);assert.equal((await ref.get()).data().tasksSolved,1);
 await Promise.all([1,2].map(()=>db.runTransaction(async tx=>{
   const snap=await tx.get(ref);tx.set(db.collection('submissions').doc(),{uid,problemId:'same-problem'});
   if (!(snap.data().solvedProblems || []).includes('same-problem')) tx.set(ref,{solvedProblems:FieldValue.arrayUnion('same-problem'),tasksSolved:FieldValue.increment(1)},{merge:true});
 })));assert.equal((await ref.get()).data().tasksSolved,2,'Concurrent correct solutions award points once');
 await assert.rejects(db.runTransaction(async tx=>{const s=await tx.get(ref);tx.set(ref,{tasksSolved:99},{merge:true});tx.update(db.doc('users/missing'),{x:1});}),/Document not found/);assert.equal((await ref.get()).data().tasksSolved,2,'Failed write must roll back the entire transaction');
 await pg.exec("insert into public.app_documents(collection,id,data) select 'cf_tasks','task-'||lpad(n::text,4,'0'),jsonb_build_object('uid','"+uid+"','contestId',42) from generate_series(1,1100) n;");
 calls=0;const all=await db.collection('cf_tasks').where('uid','==',uid).where('contestId','==',42).get();assert.equal(all.size,1100);assert.equal(calls,4);assert.equal((await db.collection('cf_tasks').limit(12).get()).size,12);
 await db.doc('submissions/owned').set({uid});await db.doc('assignments/owned').set({teacherId:uid});await db.doc('tickets/anonymous').set({userId:''});await db.doc('deletion_tokens/owned').set({uid});
 await pg.exec('reset role;');
 await pg.exec(fs.readFileSync('supabase/migrations/202610100001_vacademy.sql','utf8').replace(/^\uFEFF/,''));assert.equal((await ref.get()).data().tasksSolved,2,'Reapplying schema must preserve data');
 await pg.query('delete from auth.users where id=$1',[uid]);assert.equal((await ref.get()).exists,false);assert.equal((await db.collection('cf_tasks').get()).size,0);assert.equal((await db.collection('submissions').get()).size,0);assert.equal((await db.collection('assignments').get()).size,0);assert.equal((await db.doc('tickets/anonymous').get()).exists,true);
 console.log('Supabase migration: SQL, RLS, age checks, safe patches, atomic retries, pagination and deletion passed.');await pg.close();
})().catch(async e=>{console.error(e);await pg.close();process.exitCode=1;});
