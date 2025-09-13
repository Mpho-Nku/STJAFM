'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Notifications from '@/components/Notifications';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('viewer');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        setRole(p?.role || 'viewer');
      }
    })();
  }, []);

  if (!user) return <div>Please sign in.</div>;

  return (
    <div className="grid gap-6">
      <CreateChurch />
      <CreateEvent />
      <ManageChurches user={user} role={role} />
      <ManageEvents user={user} role={role} />
    </div>
  );
}

/* --------------------- HELPERS --------------------- */
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card p-4 space-y-3">{children}</div>;
}

function Labeled({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  );
}

/* --------------------- CREATE FORMS --------------------- */

function CreateChurch() {
  const [form, setForm] = useState<any>({
    name: '',
    pastor_name: '',
    street: '',
    area_code: '',
    suburb: '',
    township: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const submit = async () => {
    let imageUrl: string | null = null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('church-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message);
        alert('Image upload failed: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('church-images')
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    const payload = { ...form, images: imageUrl ? [imageUrl] : [] };

    const { error } = await supabase.from('churches').insert(payload);

    if (error) {
      console.error('Insert error:', error);
      alert('Insert failed: ' + error.message);
    } else {
      alert('Church created');
      setForm({
        name: '',
        pastor_name: '',
        street: '',
        area_code: '',
        suburb: '',
        township: '',
        description: '',
      });
      setFile(null);
    }
  };

  return (
    <Card>
      <h3 className="font-semibold">Add Church</h3>
      <Labeled label="Name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
      <Labeled label="Pastor" value={form.pastor_name} onChange={(e: any) => setForm({ ...form, pastor_name: e.target.value })} />
      <Labeled label="Street" value={form.street} onChange={(e: any) => setForm({ ...form, street: e.target.value })} />
      <Labeled label="Area Code" value={form.area_code} onChange={(e: any) => setForm({ ...form, area_code: e.target.value })} />
      <Labeled label="Suburb" value={form.suburb} onChange={(e: any) => setForm({ ...form, suburb: e.target.value })} />
      <Labeled label="Township" value={form.township} onChange={(e: any) => setForm({ ...form, township: e.target.value })} />
      <Labeled label="Description" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />

      <div className="space-y-1">
        <label className="label">Church Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button className="btn btn-primary" onClick={submit}>Create</button>
    </Card>
  );
}

/* ✅ CreateEvent with auto-populated location */
function CreateEvent() {
  const [churchId, setChurchId] = useState('');
  const [churches, setChurches] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
  });

  useEffect(() => {
    supabase.from('churches').select('id,name,street,suburb,township,area_code')
      .then(({ data }) => setChurches(data || []));
  }, []);

  // Prepopulate location when church selected
  useEffect(() => {
    if (churchId) {
      const church = churches.find((c) => c.id === churchId);
      if (church) {
        const loc = `${church.street || ''}, ${church.suburb || ''}, ${church.township || ''}, ${church.area_code || ''}`;
        setForm((prev: any) => ({ ...prev, location: loc }));
      }
    }
  }, [churchId, churches]);

  const submit = async () => {
    if (!churchId) return alert('Select church');
    const { error } = await supabase.from('events').insert({ ...form, church_id: churchId });
    if (error) {
      console.error('Insert error:', error);
      alert('Insert failed: ' + error.message);
    } else {
      alert('Event created');
    }
  };

  return (
    <Card>
      <h3 className="font-semibold">Add Event</h3>
      <div className="space-y-1">
        <label className="label">Church</label>
        <select className="input" value={churchId} onChange={(e) => setChurchId(e.target.value)}>
          <option value="">Choose</option>
          {churches.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <Labeled label="Title" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
      <Labeled label="Description" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
      <Labeled label="Start Time" type="datetime-local" value={form.start_time} onChange={(e: any) => setForm({ ...form, start_time: e.target.value })} />
      <Labeled label="End Time" type="datetime-local" value={form.end_time} onChange={(e: any) => setForm({ ...form, end_time: e.target.value })} />
      <Labeled label="Location" value={form.location} readOnly />
      <button className="btn btn-primary" onClick={submit}>Create</button>
    </Card>
  );
}

/* --------------------- MANAGE LISTS --------------------- */
function ManageEvents({ user, role }: { user: any; role: string }) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    let query = supabase
      .from('events')
      .select('id, title, start_time, created_by');
    if (role !== 'admin') query = query.eq('created_by', user.id);
    query.order('created_at', { ascending: false }).then(({ data }) =>
      setEvents(data || [])
    );
  }, [user, role]);

  const del = async (id: string) => {
    if (confirm('Delete this event?')) {
      await supabase.from('events').delete().eq('id', id);
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <Card>
      <h3 className="font-semibold">Manage Events</h3>
      {events.length === 0 && (
        <p className="text-neutral-400 text-sm">No events yet.</p>
      )}
      {events.map((ev) => (
        <div
          key={ev.id}
          className="flex items-center justify-between border-b border-neutral-800 py-2"
        >
          <span>
            {ev.title} ({new Date(ev.start_time).toLocaleDateString()})
          </span>
          <div className="flex gap-2">
            {/* ✅ Navigate to /events/[id]/edit instead of ?edit=true */}
            <a className="btn" href={`/events/${ev.id}/edit`}>
              Edit
            </a>
            <button className="btn" onClick={() => del(ev.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </Card>
  );
}


function ManageChurches({ user, role }: { user: any; role: string }) {
  const [churches, setChurches] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    let query = supabase.from('churches').select('id,name,pastor_name,created_by');
    if (role !== 'admin') query = query.eq('created_by', user.id);
    query.order('created_at', { ascending: false }).then(({ data }) => setChurches(data || []));
  }, [user, role]);

  const del = async (id: string) => {
    if (confirm('Delete this church?')) {
      await supabase.from('churches').delete().eq('id', id);
      setChurches(churches.filter((c) => c.id !== id));
    }
  };

  return (
    <Card>
      <h3 className="font-semibold">Manage Churches</h3>
      {churches.length === 0 && <p className="text-neutral-400 text-sm">No churches yet.</p>}
      {churches.map((ch) => (
        <div key={ch.id} className="flex items-center justify-between border-b border-neutral-800 py-2">
          <span>{ch.name} (Pastor: {ch.pastor_name || 'N/A'})</span>
          <div className="flex gap-2">
            {/* ✅ Link to new edit page */}
            <a className="btn" href={`/churches/${ch.id}/edit`}>Edit</a>
            <button className="btn" onClick={() => del(ch.id)}>Delete</button>
          </div>
        </div>
      ))}
    </Card>
  );
}

