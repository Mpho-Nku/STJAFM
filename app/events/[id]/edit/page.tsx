'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditEvent() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  // Fetch event by id
  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        if (data) {
          setForm({
            ...data,
            start_time: data.start_time
              ? new Date(data.start_time).toISOString().slice(0, 16)
              : '',
            end_time: data.end_time
              ? new Date(data.end_time).toISOString().slice(0, 16)
              : '',
          });
        }
      });
  }, [id]);

  // Update event
  const updateEvent = async () => {
    const { error } = await supabase
      .from('events')
      .update({
        title: form.title,
        description: form.description,
        start_time: form.start_time,
        end_time: form.end_time,
        location: form.location,
      })
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Event updated');
      router.push(`/events/${id}`);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Edit Event</h2>

      <input
        className="input"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Event Title"
      />

      <textarea
        className="input"
        value={form.description || ''}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
      />

      <input
        type="datetime-local"
        className="input"
        value={form.start_time}
        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
      />

      <input
        type="datetime-local"
        className="input"
        value={form.end_time}
        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
      />

      <input
        className="input"
        value={form.location || ''}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        placeholder="Location"
      />

      <button className="btn btn-primary" onClick={updateEvent}>
        Save
      </button>
    </div>
  );
}
