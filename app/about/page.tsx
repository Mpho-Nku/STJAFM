export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Main About Section */}
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-blue-900">
          About St John Apostolic Faith Mission
        </h1>

        <p className="text-slate-700 leading-relaxed">
          Welcome to <strong>St John AFM</strong>, a faith-based community built on love, service, and spiritual
          growth. This platform was created to help church members and visitors stay connected with
          upcoming events, church services, and devotional messages.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800">Our Mission</h2>
          <p className="text-slate-600">
            To spread the Gospel, strengthen communities, and create a digital space where members can
            easily access church information, devotionals, and spiritual guidance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800">What You’ll Find Here</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>Information about all churches within our circuits</li>
            <li>Upcoming church events and activities</li>
            <li>Devotional messages to strengthen your faith</li>
            <li>Directions and maps to reach church locations easily</li>
          </ul>
        </section>
      </div>

      {/* ✅ Chatbot Section */}
      <section className="p-6 bg-blue-50 rounded-lg shadow-md space-y-4">
        <p className="text-slate-700">
         With regards ti  questions you may have about St John AFM churches,
          events, or devotionals.A church admin will be available during:
        </p>
        <p className="text-slate-700 font-medium">
          Monday to Friday: 9:00 am – 8:00 pm <br />
          Saturday – Sunday: 9:00 am – 8:00 pm 
        </p>
      </section>
    </div>
  );
}
