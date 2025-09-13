'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      // ✅ Refresh Supabase session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        router.push('/'); // fallback to home
        return;
      }

      if (data.session) {
        // ✅ Always go home after login
        router.push('/');
      } else {
        router.push('/'); // no session, still go home
      }
    };

    handleSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Signing you in...</p>
    </div>
  );
}
