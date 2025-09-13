'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BellIcon } from '@heroicons/react/24/outline';

export default function NotificationBell() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // ✅ Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    // ✅ Fetch upcoming events
    supabase
      .from('events')
      .select('id, title, start_time, location')
      .gt('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5)
      .then(({ data, error }) => {
        if (!error && data) setEvents(data);
      });
  }, [user]);

  return (
    <div className="relative">
      {/* Bell icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none"
      >
        <BellIcon className="h-6 w-6 text-gray-700" />
        {events.length > 0 && (
          <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-600"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>
          <ul className="max-h-60 overflow-y-auto">
            {events.length === 0 && (
              <li className="p-3 text-sm text-gray-500">No upcoming events</li>
            )}
            {events.map((event) => (
              <li
                key={event.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <p className="font-medium text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(event.start_time).toLocaleString()}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-400">{event.location}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
