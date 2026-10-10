-- Run in Supabase SQL Editor before deploying the Supabase version.
begin;
create table if not exists public.app_documents (
  collection text not null check (collection <> '' and position('/' in collection) = 0),
  id text not null check (id <> '' and position('/' in id) = 0),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  version bigint not null default 1,
  primary key (collection, id)
);
create index if not exists app_documents_data_idx on public.app_documents using gin(data jsonb_path_ops);
alter table public.app_documents enable row level security;
revoke all on public.app_documents from public, anon, authenticated;
grant all on public.app_documents to service_role;

create or replace function public.vacademy_apply_patch(current_value jsonb, patch jsonb, do_merge boolean)
returns jsonb language plpgsql set search_path = '' as $$
declare result jsonb; item record; v jsonb;
begin
  case patch->>'kind'
    when 'value' then return patch->'value';
    when 'timestamp' then return to_jsonb(now());
    when 'increment' then
      return to_jsonb((case when jsonb_typeof(current_value) = 'number' then (current_value #>> '{}')::numeric else 0 end) + (patch->>'value')::numeric);
    when 'union' then
      result := case when jsonb_typeof(current_value) = 'array' then current_value else '[]'::jsonb end;
      for v in select value from jsonb_array_elements(patch->'value') loop
        if not exists(select 1 from jsonb_array_elements(result) e where e.value = v) then result := result || jsonb_build_array(v); end if;
      end loop;
      return result;
    when 'remove' then
      select coalesce(jsonb_agg(e.value), '[]'::jsonb) into result
      from jsonb_array_elements(case when jsonb_typeof(current_value) = 'array' then current_value else '[]'::jsonb end) e
      where not exists(select 1 from jsonb_array_elements(patch->'value') r where r.value = e.value);
      return result;
    when 'object' then
      result := case when do_merge and jsonb_typeof(current_value) = 'object' then current_value else '{}'::jsonb end;
      for item in select key, value from jsonb_each(patch->'entries') loop
        result := jsonb_set(result, array[item.key], public.vacademy_apply_patch(result->item.key, item.value, do_merge), true);
      end loop;
      return result;
    else raise exception 'Invalid patch';
  end case;
end $$;

create or replace function public.vacademy_commit(p_reads jsonb, p_writes jsonb)
returns void language plpgsql set search_path = '' as $$
declare item jsonb; path text; actual_version bigint; current_data jsonb; result jsonb;
begin
  -- All paths, including absent rows, lock in the same order. This also protects increments.
  for path in select distinct value->>'collection' || '/' || (value->>'id') from jsonb_array_elements(p_reads || p_writes) order by 1 loop
    perform pg_advisory_xact_lock(hashtextextended(path, 0));
  end loop;
  for item in select value from jsonb_array_elements(p_reads) loop
    select version into actual_version from public.app_documents where collection = item->>'collection' and id = item->>'id';
    if actual_version is distinct from (item->>'version')::bigint then raise exception 'Transaction conflict' using errcode = '40001'; end if;
  end loop;
  for item in select value from jsonb_array_elements(p_writes) loop
    if item->>'mode' = 'delete' then
      delete from public.app_documents where collection = item->>'collection' and id = item->>'id';
    else
      select data into current_data from public.app_documents where collection = item->>'collection' and id = item->>'id';
      if item->>'mode' = 'update' and current_data is null then raise exception 'Document not found' using errcode = 'P0002'; end if;
      result := public.vacademy_apply_patch(current_data, item->'patch', coalesce((item->>'merge')::boolean, false));
      insert into public.app_documents(collection, id, data) values(item->>'collection', item->>'id', result)
      on conflict(collection, id) do update set data = excluded.data, version = public.app_documents.version + 1;
    end if;
  end loop;
end $$;
revoke all on function public.vacademy_apply_patch(jsonb,jsonb,boolean) from public, anon, authenticated;
revoke all on function public.vacademy_commit(jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.vacademy_apply_patch(jsonb,jsonb,boolean) to service_role;
grant execute on function public.vacademy_commit(jsonb,jsonb) to service_role;

create or replace function public.vacademy_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb); ack jsonb;
begin
  ack := metadata->'legalAcknowledgement';
  if ack is null or ack->>'version' is distinct from '2026-10-10'
    or ack->>'ageRange' not in ('13-17','18+') or ack->>'ageRange' is null
    or ack->'termsAccepted' is distinct from 'true'::jsonb or ack->'privacyRead' is distinct from 'true'::jsonb
    or jsonb_typeof(ack->'guardianPermission') is distinct from 'boolean'
    or (ack->>'ageRange' = '13-17' and ack->'guardianPermission' is distinct from 'true'::jsonb) then
    raise exception 'Valid age, terms, privacy and guardian acknowledgement required';
  end if;
  insert into public.app_documents(collection,id,data) values('users',new.id::text,
    jsonb_build_object('uid',new.id::text,'email',new.email,'displayName',coalesce(metadata->>'displayName',''),
      'photoURL',coalesce(metadata->>'photoURL',''),'school',coalesce(metadata->>'school',''),'about',coalesce(metadata->>'about',''),
      'goal',coalesce(metadata->>'goal',''),'role','student','tasksSolved',0,'totalScore',0,'solvedProblems','[]'::jsonb,
      'streakDays',0,'maxStreakDays',0,'studyTimeMinutes',0,'subjectProgress','{}'::jsonb,
      'createdAt',now(),'updatedAt',now(),'legalAcknowledgement',jsonb_build_object(
        'version',ack->>'version','ageRange',ack->>'ageRange','termsAccepted',true,'privacyRead',true,'guardianPermission',ack->'guardianPermission','acceptedAt',now())));
  return new;
end $$;
create or replace function public.vacademy_delete_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.app_documents where
    (collection in ('users','teacher_applications') and id = old.id::text)
    or (collection in ('submissions','cf_tasks','deletion_tokens') and data->>'uid' = old.id::text)
    or (collection = 'assignments' and data->>'teacherId' = old.id::text)
    or (collection = 'tickets' and data->>'userId' = old.id::text);
  return old;
end $$;
revoke all on function public.vacademy_new_user() from public, anon, authenticated;
revoke all on function public.vacademy_delete_user() from public, anon, authenticated;
drop trigger if exists vacademy_auth_created on auth.users;
create trigger vacademy_auth_created after insert on auth.users for each row execute function public.vacademy_new_user();
drop trigger if exists vacademy_auth_deleted on auth.users;
create trigger vacademy_auth_deleted after delete on auth.users for each row execute function public.vacademy_delete_user();
commit;
