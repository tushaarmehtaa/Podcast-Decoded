alter table public.episodes enable row level security;

create policy "Allow anon read episodes"
on public.episodes
for select
to anon
using (true);

create policy "Allow service role full access to episodes"
on public.episodes
for all
to service_role
using (true)
with check (true);
