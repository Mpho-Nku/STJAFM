'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { UserIcon, MapPinIcon } from '@heroicons/react/24/solid';

export default function ChurchDetail() {
  const params = useParams();
  const churchId = params?.id as string;

  const [church, setChurch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!churchId) return;

    // Fetch church
    supabase
      .from('churches')
      .select('*')
      .eq('id', churchId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('Church fetch error:', error);
        else setChurch(data);
      });

    // Fetch events for this church
    supabase
      .from('events')
      .select('*')
      .eq('church_id', churchId)
      .order('start_time', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Events fetch error:', error);
        else setEvents(data || []);
      });
  }, [churchId]);

  if (!church) return <div>Loading church details...</div>;

  // ✅ Build Google Maps directions link
  const getDirectionsUrl = () => {
    const address = `${church.street || ''}, ${church.suburb || ''}, ${church.township || ''}, ${church.area_code || ''}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  };

  return (
    <div className="space-y-6">
      {/* ✅ Church card with image */}
      <div className="p-4 bg-white rounded-lg space-y-3 shadow-md">
        {church.images && church.images.length > 0 && (
          <Image
            src={church.images[0]}
            alt={church.name}
            width={600}
            height={300}
            className="rounded-lg object-cover w-full h-64"
          />
        )}
        <h2 className="text-xl font-bold">{church.name}</h2>

        {/* Pastor */}
        <div className="flex items-center text-sm text-slate-600">
          <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span>Pastor: {church.pastor_name || 'N/A'}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-slate-600">
          <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span>
            {church.street}, {church.suburb}, {church.township},{' '}
            {church.area_code}
          </span>
        </div>

        {church.description && (
          <p className="mt-2 text-slate-500">{church.description}</p>
        )}

        {/* ✅ Directions button */}
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Get Directions
        </a>
      </div>

      {/* Events */}
      <div>
        <h3 className="text-lg font-semibold">All Events (including past)</h3>
        {events.length === 0 && (
          <p className="text-blue-400 text-sm">
            No events found for this church.
          </p>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className="p-3 my-2 border border-blue-300 rounded-lg bg-blue-50"
          >
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-blue-600">
              {new Date(event.start_time).toLocaleString()}
              {event.end_time &&
                ' - ' + new Date(event.end_time).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">{event.description}</p>
            <div className="flex items-center text-sm text-slate-600">
              <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
