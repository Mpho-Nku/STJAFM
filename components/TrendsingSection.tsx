'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState<'events' | 'churches'>('events');
  const [events, setEvents] = useState<any[]>([]);
  const [churches, setChurches] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Fetch top events (only with likes > 0)
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, likes, church:church_id(name)')
        .gt('likes', 0) // 👈 only events with likes > 0
        .order('likes', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching trending events:', error.message);
      } else {
        setEvents(data || []);
      }
    };

    // ✅ Fetch top churches (only with likes > 0)
    const fetchChurches = async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('id, name, pastor_name, township, suburb, likes')
        .gt('likes', 0) // 👈 only churches with likes > 0
        .order('likes', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching trending churches:', error.message);
      } else {
        setChurches(data || []);
      }
    };

    fetchEvents();
    fetchChurches();
  }, []);

  return (
    <section className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">🔥 Trending</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-2 px-2 ${
            activeTab === 'events'
              ? 'border-b-2 border-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('churches')}
          className={`pb-2 px-2 ${
            activeTab === 'churches'
              ? 'border-b-2 border-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          Churches
        </button>
      </div>

      {/* Events */}
      {activeTab === 'events' && (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="p-3 border rounded-lg hover:shadow transition bg-gray-50 flex justify-between items-center"
            >
              <div>
                <Link href={`/events/${ev.id}`} className="font-medium text-blue-800">
                  {ev.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {ev.church?.name || 'Unknown Church'} –{' '}
                  {new Date(ev.start_time).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <HandThumbUpIcon className="h-5 w-5" />
                <span className="text-sm">{ev.likes || 0}</span>
              </div>
            </li>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-gray-500">No trending events yet.</p>
          )}
        </ul>
      )}

      {/* Churches */}
      {activeTab === 'churches' && (
        <ul className="space-y-3">
          {churches.map((ch) => (
            <li
              key={ch.id}
              className="p-3 border rounded-lg hover:shadow transition bg-gray-50 flex justify-between items-center"
            >
              <div>
                <Link href={`/churches/${ch.id}`} className="font-medium text-blue-800">
                  {ch.name}
                </Link>
                <p className="text-sm text-gray-500">
                  Pastor: {ch.pastor_name || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">
                  {ch.township}, {ch.suburb}
                </p>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <HandThumbUpIcon className="h-5 w-5" />
                <span className="text-sm">{ch.likes || 0}</span>
              </div>
            </li>
          ))}
          {churches.length === 0 && (
            <p className="text-sm text-gray-500">No trending churches yet.</p>
          )}
        </ul>
      )}
    </section>
  );
}
