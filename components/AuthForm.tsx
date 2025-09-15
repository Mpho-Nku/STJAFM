'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      window.location.href = '/'; // Redirect after login
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      alert('Signup successful! Please check your email to confirm.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h1 className="text-xl font-bold text-center">Login / Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
