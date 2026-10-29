create table if not exists public.website_leads (
 id uuid primary key, brief jsonb not null, source_hash text not null,
 created_at bigint not null, status text not null default 'new'
);
alter table public.website_leads enable row level security;
revoke all on public.website_leads from anon, authenticated;
create index if not exists website_leads_source_created on public.website_leads(source_hash,created_at);
create or replace function public.submit_website_lead(brief jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare prior uuid; total integer; request_id uuid; source text; timestamp_ms bigint;
begin
 request_id := (brief->>'requestId')::uuid;
 source := brief->>'sourceHash';
 timestamp_ms := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
 if source is null or length(source) <> 64 then raise exception 'Invalid source'; end if;
 perform pg_advisory_xact_lock(hashtextextended(source,0));
 select id into prior from public.website_leads where id=request_id and source_hash=source;
 if prior is not null then return jsonb_build_object('id',prior); end if;
 select count(*) into total from public.website_leads where source_hash=source and created_at>timestamp_ms-3600000;
 if total>=5 then return jsonb_build_object('limited',true); end if;
 insert into public.website_leads(id,brief,source_hash,created_at)
 values(request_id,brief - 'companyFax' - 'sourceHash',source,timestamp_ms);
 return jsonb_build_object('id',request_id);
end;
$$;
revoke all on function public.submit_website_lead(jsonb) from public, anon, authenticated;
grant execute on function public.submit_website_lead(jsonb) to service_role;
