'use client';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';   // 👈 add this
import { BellIcon } from '@heroicons/react/24/outline';


function WeekendEvents() {
  const [weekendEvents, setWeekendEvents] = useState<any[]>([]);

  useEffect(() => {
    // Get start & end of this weekend
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diffToFriday = (5 - day + 7) % 7; 
    const friday = new Date(now);
    friday.setDate(now.getDate() + diffToFriday);
    friday.setHours(0, 0, 0, 0);

    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    sunday.setHours(23, 59, 59, 999);

    // Fetch events in this range
    supabase
      .from('events')
      .select('id,title,start_time')
      .gte('start_time', friday.toISOString())
      .lte('start_time', sunday.toISOString())
      .order('start_time', { ascending: true })
      .then(({ data }) => setWeekendEvents(data || []));
  }, []);

  if (weekendEvents.length === 0) {
    return <div className="p-3 text-sm text-gray-500">No events this weekend</div>;
  }

  return (
    <ul className="max-h-40 overflow-y-auto">
      {weekendEvents.map((ev) => (
        <li key={ev.id} className="p-3 border-b hover:bg-gray-50">
          <Link href={`/events/${ev.id}`}>
            <div className="font-medium text-blue-800">{ev.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(ev.start_time).toLocaleString()}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
