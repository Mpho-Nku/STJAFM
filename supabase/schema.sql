-- Allow public read access (anyone can view images)
create policy "Allow public read"
on storage.objects
for select
using (bucket_id = 'CHURCH-IMAGES');

-- Allow users to delete only their own files
create policy "Allow delete own files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'CHURCH-IMAGES' and owner = auth.uid());

-- (Optional) Allow admins to delete all files
create policy "Allow admin delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'CHURCH-IMAGES'
  and exists (
    select 1
    from profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
