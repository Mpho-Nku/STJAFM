'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fmtDate } from '@/lib/utils';

export default function EventDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Get logged-in user
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user);

        // ✅ Fetch event and church details
        const { data, error } = await supabase
          .from('events')
          .select('*, church:church_id(*)')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Event fetch error:', error.message);
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ Toggle save/unsave
  const toggleSaveEvent = async () => {
    if (!user) return alert('Please login to save events');

    const alreadySaved = event?.is_saved_by?.includes(user.id);
    const newSavedBy = alreadySaved
      ? (event.is_saved_by || []).filter((uid: string) => uid !== user.id)
      : [...(event?.is_saved_by || []), user.id];

    const { error } = await supabase
      .from('events')
      .update({ is_saved_by: newSavedBy })
      .eq('id', id);

    if (error) {
      console.error('Save/Unsave failed:', error.message);
      alert('Something went wrong');
    } else {
      setEvent({ ...event, is_saved_by: newSavedBy });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div className="text-red-500">Event not found</div>;

  const isSaved = user && event.is_saved_by?.includes(user.id);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Title + Date */}
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <div className="text-blue-600">{fmtDate(event.start_time)}</div>
      <p className="text-gray-700">{event.description}</p>

      {/* Church Info */}
      {event.church && (
        <div className="card p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold">Hosted by: {event.church.name}</h3>
          <p className="text-sm text-gray-500">
            {[event.church.street, event.church.suburb, event.church.township]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}

      {/* Save/Unsave button */}
      {user && (
        <button
          className={`btn ${isSaved ? 'bg-gray-300 text-black' : 'btn-primary'}`}
          onClick={toggleSaveEvent}
        >
          {isSaved ? 'Unsave Event' : 'Save Event'}
        </button>
      )}
    </div>
  );
}
