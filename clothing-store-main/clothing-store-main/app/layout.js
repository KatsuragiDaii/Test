// app/layout.js
import { Poppins } from 'next/font/google';
import './globals.css'; // Sesuaikan dengan path file CSS global tokomu

// 1. IMPORT KEMBALI: Panggil komponen Header & Footer milikmu (Sesuaikan path foldernya ya!)
import Header from '../components/Header'; // atau '@/components/Header' jika pakai alias path
import Footer from '../components/Footer'; // atau '@/components/Footer'

// Konfigurasi font Poppins global
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Zahwa Clothing',
  description: 'A New Mix of Classics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-white text-neutral-900 flex flex-col min-h-screen`}>
        
        {/* 2. PASANG KEMBALI: Header di posisi paling atas layar */}
        <Header />
        
        {/* Pembungkus konten halaman utama agar footer terdorong rapi ke bawah jika halaman sepi */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* 3. PASANG KEMBALI: Footer di posisi paling bawah layar */}
        <Footer />

      </body>
    </html>
  );
}