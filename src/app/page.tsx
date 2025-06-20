"use client";
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import VideoDownloader from '@/components/VideoDownloader';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <VideoDownloader />
      </main>
      <Footer />
    </div>
  </ThemeProvider>
  );
}
