import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
export const metadata = { title: 'St John AFM', description: 'Church app' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}
            <Footer />
        </main>
        
      </body>
    </html>
  );
}
