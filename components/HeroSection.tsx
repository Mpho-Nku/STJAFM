'use client';
import { useState } from 'react';

export default function HeroSection() {
  const [query, setQuery] = useState('');

  return (
    <div
      className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/campus-bg.jpg')" }} // ✅ replace with your image path
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Real College Dorm Reviews
        </h1>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search for your school"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-[500px] p-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
