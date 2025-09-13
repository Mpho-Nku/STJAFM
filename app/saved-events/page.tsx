'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SavedEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Fetch events where current user id is inside is_saved_by array
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .contains('is_saved_by', [user.id]) // ✅ match user in saved list
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching saved events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchSavedEvents();
  }, []);

  if (loading) return <div className="p-6">Loading saved events...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">My Saved Events</h1>

      {events.length === 0 && (
        <p className="text-gray-500">You haven’t saved any events yet.</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-white rounded-lg shadow-md border border-blue-200"
          >
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-sm text-blue-600">
              {new Date(event.start_time).toLocaleString()}{" "}
              {event.end_time &&
                " → " + new Date(event.end_time).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">📍 {event.location}</p>

            <Link
              href={`/churches/${event.church_id}`}
              className="text-sm text-blue-500 hover:underline"
            >
              View Church →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
