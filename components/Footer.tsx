export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto py-4 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-600">
        <nav className="flex gap-6">
          <a href="/blog" className="hover:text-blue-600">Blog</a>
          <a href="/churches" className="hover:text-blue-600">All Churches</a>
          <a href="/about" className="hover:text-blue-600">About</a>
        </nav>
        <p className="text-xs text-gray-500">
          Terms & Conditions • Privacy Policy • All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
