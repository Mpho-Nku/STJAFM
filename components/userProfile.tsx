'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fetch current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) setProfile(data);
  };

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id);
    if (error) alert('Update failed: ' + error.message);
    else alert('Profile updated!');
  };

  if (!user) return <div>Please log in to view your profile.</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">My Profile</h2>
      <input
        className="input"
        placeholder="Full name"
        value={profile.full_name || ''}
        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
      />
      <input
        className="input"
        placeholder="Avatar URL"
        value={profile.avatar_url || ''}
        onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
      />
      <textarea
        className="input"
        placeholder="Bio"
        value={profile.bio || ''}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      />
      <div>
        <label className="block text-sm font-semibold">Role</label>
        <select
          className="input"
          value={profile.role || 'viewer'}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          disabled // prevent regular users from changing their own role
        >
          <option value="viewer">Viewer</option>
          <option value="member">Member</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">* Only admins can change roles</p>
      </div>
      <button className="btn btn-primary" onClick={updateProfile}>Save</button>
    </div>
  );
}
