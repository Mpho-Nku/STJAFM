export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Main About Section */}
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-blue-900">
          St John Apostolic Faith Mission
        </h1>

        <p className="text-slate-700 leading-relaxed">
          Welcome to <strong>St John AFM</strong>, a faith-based community built on love, service, and spiritual
          growth. This platform was created to help church members and visitors stay connected with
          upcoming events, church services, and devotional messages.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800">Founding and Vision:</h2>
          <p className="text-slate-600">
         Founder: Prophetess Christinah Nku, a black female pioneer, founded the church after receiving visions from God, which included a vision of a church with 12 doors. 
         Date: The church was established around 1938 or 1939. 
         Location: Its original headquarters were on a farm in Evaton, near Johannesburg. 
         Spiritual Roots: The founding of St John's reflects a movement of Africans who sought religious independence from white mission churches, creating new religious expressions that fused Christian and pre-colonial African traditions. 
          </p>
        </section>

        <section className="space-y-3">

          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>Founder: Prophetess Christinah Nku, a black female pioneer, founded the church after receiving visions from God, which included a vision of a church with 12 doors</li>
            <li>Date: The church was established around 1938 or 1939. </li>
            <li>Location: Its original headquarters were on a farm in Evaton, near Johannesburg</li>
            <li>Spiritual Roots: The founding of St John's reflects a movement of Africans who sought religious independence from white mission churches, creating new religious expressions that fused Christian and pre-colonial African traditions</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
