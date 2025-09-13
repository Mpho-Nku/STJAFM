'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

export default function ExplorePage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all churches
      const { data: churchData } = await supabase
        .from('churches')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all events
      const { data: eventData } = await supabase
        .from('events')
        .select('*, churches(name, images)')
        .order('start_time', { ascending: true });

      setChurches(churchData || []);
      setEvents(eventData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading Explore...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-blue-900">Explore</h1>
      <p className="text-slate-600">
        Browse through churches, upcoming events, and devotionals shared by the community.
      </p>

      {/* Churches Section */}
      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">⛪ Churches</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {churches.map((church) => (
            <Link
              key={church.id}
              href={`/churches/${church.id}`}
              className="card p-4 space-y-3 hover:shadow-lg transition"
            >
              {church.images?.length > 0 && (
                <Image
                  src={church.images[0]}
                  alt={church.name}
                  width={400}
                  height={200}
                  className="rounded-lg w-full h-40 object-cover"
                />
              )}
              <h3 className="text-lg font-bold">{church.name}</h3>
              <p className="text-sm text-slate-600">
                Pastor: {church.pastor_name || 'N/A'}
              </p>
              <p className="text-xs text-slate-500">
                {church.suburb}, {church.township}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📅 Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/churches/${event.church_id}`}
              className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:shadow-md transition"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-slate-600">
                {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">{event.location}</p>
              {event.churches?.images?.[0] && (
                <Image
                  src={event.churches.images[0]}
                  alt={event.churches.name}
                  width={400}
                  height={200}
                  className="rounded-lg w-full h-32 object-cover mt-2"
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Placeholder Devotionals */}
      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📖 Devotionals</h2>
        <p className="text-slate-500 text-sm">Coming soon...</p>
      </section>
    </div>
  );
}
