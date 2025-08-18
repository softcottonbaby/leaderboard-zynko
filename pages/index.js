import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchVideos() {
    try {
      const res = await fetch('/api/youtube');
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(data);
        setError(null);
      } else {
        setVideos([]);
        setError(data?.error || 'Failed to load videos.');
      }
    } catch (err) {
      setVideos([]);
      setError(err.message);
    }
  }
  fetchVideos();
}, []);

  return (
    <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative">

      {/* Glowing red background behind footer and bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-red-500 blur-3xl opacity-20 pointer-events-none z-0" />

      <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10">

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none" />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[
                { href: '/', label: 'Home' },
                { href: '/leaderboard', label: 'Leaderboards' },
                { href: '/bonuses', label: 'Bonuses' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="relative group">
                  <span className="text-white hover:text-red-400 transition">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <img
            src="/logo/logoZynko.webp"
            alt="ZYNKO Logo"
            className="h-24 md:h-32 mb-4 animate-float select-none pointer-events-none"
          />
          <p className="text-[#E2E2E2] text-lg md:text-xl font-medium leading-snug tracking-wide text-center drop-shadow-sm">
            Rain.gg, Clash.gg, and Csgoroll.com<br />
            Leaderboards, Exclusive Bonuses & More!
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/leaderboard">
              <button className="px-8 py-2 text-white font-semibold text-sm rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3),inset_0_0_3px_rgba(255,80,80,0.2)] hover:scale-105 active:scale-95 active:brightness-110 transition duration-200 tracking-wide">
                LEADERBOARDS
              </button>
            </Link>
            <Link href="/bonuses">
              <button className="px-8 py-2 text-white font-semibold text-sm rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3),inset_0_0_3px_rgba(255,80,80,0.2)] hover:scale-105 active:scale-95 active:brightness-110 transition duration-200 tracking-wide">
                ALL BONUSES
              </button>
            </Link>
          </div>
          <div className="mt-10 animate-bounce text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Video Grid */}
        <section className="w-full max-w-6xl px-4 pb-20 mt-10">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Latest YouTube Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.length === 0 && (
              <p className="text-white/60 text-sm col-span-full">
                {error ? `Error: ${error}` : 'No videos found or failed to load.'}
              </p>
            )}
            {videos.map((video) => (
              <a
                key={video.snippet.resourceId.videoId}
                href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 rounded-lg overflow-hidden shadow-md hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-shadow duration-300 
             opacity-0 translate-y-4 animate-fadeIn"
              >

                <img
                  src={video.snippet.thumbnails?.medium?.url}
                  alt={video.snippet.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-white text-sm font-medium">
                  {video.snippet.title}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Sparkles Effect */}
<div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
  {Array.from({ length: 30 }).map((_, i) => (
    <span
      key={i}
      className="sparkle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${4 + Math.random() * 3}s`,
      }}
    />
  ))}
</div>



      {/* Footer */}
      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 relative z-10">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a
              href="https://www.youtube.com/@zynko333/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5" />
            </a>

            <a
              href="https://kick.com/zynkogambles"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" />
            </a>

            <a
              href="https://discord.gg/zynko"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5" />
            </a>
          </div>

          <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
          <p className="text-white/50 text-xs mt-1">
            Made by <a href="https://x.com/MMesinco" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">acesnap</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
