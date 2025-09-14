'use client';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { BellIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

import HeroSection from './HeroSection';
export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // notifications dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(false);
  const [weekendEvents, setWeekendEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // ✅ Fetch latest events for notifications
  useEffect(() => {
    if (!user) return;
    supabase
      .from('events')
      .select('id,title,start_time,church_id')
      .order('start_time', { ascending: true })
      .limit(5)
      .then(({ data }) => {
        const events = data || [];
        setNotifications(events);

        const seen = JSON.parse(localStorage.getItem('seenNotifications') || '[]');
        const unseen = events.some((e) => !seen.includes(e.id));
        setUnread(unseen);
      });
  }, [user]);

  // ✅ Weekend events
  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const friday = new Date(now);
    friday.setDate(now.getDate() - now.getDay() + 5);
    friday.setHours(0, 0, 0, 0);
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    sunday.setHours(23, 59, 59, 999);

    if (now < friday) {
      friday.setDate(friday.getDate() - 7);
      sunday.setDate(sunday.getDate() - 7);
    }

    supabase
      .from('events')
      .select('id,title,start_time,church_id')
      .gte('start_time', friday.toISOString())
      .lte('start_time', sunday.toISOString())
      .order('start_time', { ascending: true })
      .then(({ data }) => setWeekendEvents(data || []));
  }, [user]);

  const markAsRead = () => {
    const seen = notifications.map((n) => n.id);
    localStorage.setItem('seenNotifications', JSON.stringify(seen));
    setUnread(false);
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="w-full border-b border-blue-800 sticky top-0 z-30 backdrop-blur bg-white/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-900">
          <Image src="/logo.png" width={40} height={40} alt="logo" className="rounded-full" />
          St John AFM
        </Link>

        {/* ✅ Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/auth" className="btn">Login</Link>
              <Link href="/auth" className="btn btn-primary">Sign up</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="btn">Dashboard</Link>
              <Link href="/saved-events" className="btn">Saved Events</Link>
              <button className="btn" onClick={signOut}>Sign out</button>

              {/* 🔔 Notification Bell */}
              <div className="relative">
                <button
                  className="p-2 relative"
                  onClick={() => {
                    setOpen(!open);
                    if (!open) markAsRead();
                  }}
                >
                  <BellIcon className={`h-6 w-6 ${unread ? 'text-blue-600' : 'text-gray-400'}`} />
                  {unread && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="p-3 font-semibold text-blue-900 border-b">Notifications</div>
                    <ul className="max-h-48 overflow-y-auto">
                      {notifications.map((n) => (
                        <li key={n.id} className="p-3 border-b hover:bg-gray-50">
                          <Link href={`/churches/${n.church_id}`} onClick={() => setOpen(false)}>
                            <div className="font-medium text-blue-800">{n.title}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(n.start_time).toLocaleString()}
                            </div>
                          </Link>
                        </li>
                      ))}
                      {notifications.length === 0 && (
                        <li className="p-3 text-sm text-gray-500">No new events.</li>
                      )}
                    </ul>
                    <div className="p-3 font-semibold text-blue-900 border-t">This Weekend</div>
                    <ul className="max-h-40 overflow-y-auto">
                      {weekendEvents.map((ev) => (
                        <li key={ev.id} className="p-3 border-b hover:bg-gray-50">
                          <Link href={`/churches/${ev.church_id}`} onClick={() => setOpen(false)}>
                            <div className="font-medium text-blue-800">{ev.title}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(ev.start_time).toLocaleString()}
                            </div>
                          </Link>
                        </li>
                      ))}
                      {weekendEvents.length === 0 && (
                        <li className="p-3 text-sm text-gray-500">No weekend events.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ✅ Mobile hamburger */}
        <button
          className="md:hidden text-blue-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
        </button>
      </div>

      {/* ✅ Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {!user ? (
              <>
                <Link href="/auth" className="btn w-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="btn w-full" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/saved-events" className="btn w-full" onClick={() => setMenuOpen(false)}>Saved Events</Link>
                <button className="btn w-full" onClick={() => { signOut(); setMenuOpen(false); }}>Sign out</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
