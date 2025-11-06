alter table public.requests enable row level security;

create policy "Allow anon read requests"
on public.requests
for select
to anon
using (true);

create policy "Allow anon insert requests"
on public.requests
for insert
to anon
with check (true);

create policy "Allow service role manage requests"
on public.requests
for all
to service_role
using (true)
with check (true);
