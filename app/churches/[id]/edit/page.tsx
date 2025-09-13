'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditChurch() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    supabase.from('churches').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm(data);
    });
  }, [id]);

  const updateChurch = async () => {
    const { error } = await supabase.from('churches').update(form).eq('id', id);
    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Church updated');
      router.push(`/churches/${id}`);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Edit Church</h2>
      <input
        className="input"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="input"
        value={form.pastor_name}
        onChange={(e) => setForm({ ...form, pastor_name: e.target.value })}
      />

       <input
        className="input"
        value={form.street}
        onChange={(e) => setForm({ ...form, street: e.target.value })}
      />

        <input
        className="input"
        value={form.suburb}
        onChange={(e) => setForm({ ...form, suburb: e.target.value })}
      />

     <input
        className="input"
        value={form.township}
        onChange={(e) => setForm({ ...form, township: e.target.value })}
      />

      <input
        className="input"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

       <input
        className="input"
        value={form.township}
        onChange={(e) => setForm({ ...form, township: e.target.value })}
      />
     
      <textarea
        className="input"
        value={form.description || ''}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button className="btn btn-primary" onClick={updateChurch}>Save</button>
    </div>
  );
}
