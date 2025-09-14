// components/AuthForm.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email to confirm your account!');
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Signed in successfully!');
      window.location.href = '/'; // redirect home
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Login / Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input w-full"
      />
      <div className="flex gap-3">
        <button onClick={handleSignIn} disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Loading...' : 'Login'}
        </button>
        <button onClick={handleSignUp} disabled={loading} className="btn w-full">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
