'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CircuitDetail({ params }: any) {
  const id = params.id;
  const [circuit, setCircuit] = useState<any>(null);
  const [churches, setChurches] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('circuits').select('*').eq('id', id).single().then(({ data }) => setCircuit(data));
    supabase.from('churches').select('*').eq('circuit_id', id).then(({ data }) => setChurches(data || []));
  }, [id]);

  if (!circuit) return <div>Loading...</div>;
  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-2">
        <h1 className="text-2xl font-bold">{circuit.name}</h1>
        <p className="text-neutral-300">{circuit.description}</p>
        <p className="text-neutral-400 text-sm">{[circuit.suburb, circuit.township].filter(Boolean).join(', ')}</p>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Churches in this circuit</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {churches.map(ch => (
            <Link key={ch.id} href={`/churches/${ch.id}`} className="card p-4">
              <div className="font-semibold">{ch.name}</div>
              <div className="text-sm text-neutral-400">Pastor: {ch.pastor_name || 'N/A'}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
