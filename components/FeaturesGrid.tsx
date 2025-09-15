'use client';
import { MapPinIcon, BellIcon, BuildingLibraryIcon, MapIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Find Places',
    description: 'Locate nearby churches, circuits, and fellowship points easily.',
    icon: <MapPinIcon className="h-12 w-12 text-blue-600" />,
    link: '/find-places',
  },
  {
    title: 'Visit Churches',
    description: 'Explore different churches and learn more about their activities.',
    icon: <BuildingLibraryIcon className="h-12 w-12 text-green-600" />,
    link: '/churches',
  },
  {
    title: 'Event Notifications',
    description: 'Stay updated with the latest events and announcements.',
    icon: <BellIcon className="h-12 w-12 text-yellow-600" />,
    link: '/events',
  },
  {
    title: 'Get Directions',
    description: 'Receive proper directions to attend services and events.',
    icon: <MapIcon className="h-12 w-12 text-red-600" />,
    link: '/directions',
  },
];

export default function FeaturesGrid() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Explore Features</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>{feature.icon}</div>
            </div>
            <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
       
          </div>
        ))}
      </div>
    </div>
  );
}
