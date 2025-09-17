'use client';
import Image from 'next/image';

export default function NoResults({ message = "No results found" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <Image
        src="/NoResults.png" // place your uploaded image inside /public
        alt="No results"
        width={300}
        height={200}
        className="mb-6"
      />
      <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
      <p className="text-sm text-gray-500 mt-2">
        Try different keywords or remove search filters
      </p>
    </div>
  );
}
