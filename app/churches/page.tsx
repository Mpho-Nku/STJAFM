'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

import NoResults from '@/components/NoResults';
export default function ChurchesPage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching churches:', error);
    else setChurches(data || []);
  };

  // Filtered results client-side
  const filteredChurches = churches.filter((c) =>
    [c.name, c.pastor_name, c.suburb, c.township]
      .filter(Boolean) // remove nulls
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Churches</h1>

      {/* 🔍 Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, pastor, suburb, or township..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* Churches list */}
      {filteredChurches.length === 0 ? (
        <p className="text-gray-500">
         <NoResults/>
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredChurches.map((church) => (
            <Link
              href={`/churches/${church.id}`}
              key={church.id}
              className="card p-4 hover:shadow-lg transition"
            >
              {church.images?.length > 0 && (
                <Image
                  src={church.images[0]}
                  alt={church.name}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="text-lg font-semibold">{church.name}</h2>
              <p className="text-sm text-gray-600">
                Pastor: {church.pastor_name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {church.street}, {church.suburb}, {church.township}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
