import { useEffect, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Memoized FloatingItem to prevent re-renders
const FloatingItem = memo(({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`absolute opacity-0 ${className}`}
      style={{ willChange: 'transform, opacity' }}
      loading="lazy"
    />
  );
});
FloatingItem.displayName = 'FloatingItem';

// Memoized VideoCard to prevent re-renders
const VideoCard = memo(({ video }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-black/60 rounded-lg overflow-hidden shadow-md hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-shadow duration-300 opacity-0 translate-y-4 animate-fadeIn"
  >
    <img
      src={video.snippet.thumbnails?.medium?.url}
      alt={video.snippet.title}
      className="w-full h-40 object-cover"
      loading="lazy"
    />
    <div className="p-4 text-white text-sm font-medium line-clamp-2">
      {video.snippet.title}
    </div>
  </a>
));
VideoCard.displayName = 'VideoCard';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const showVideos = false; // 🔴 set to true later to re-enable the YouTube videos section

  // Use useCallback to prevent recreation of function
  const fetchVideos = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (showVideos) {
      fetchVideos();
    }
  }, [fetchVideos, showVideos]);

  return (
    <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative">
      {/* Glowing red background - optimized with CSS instead of blur */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none z-0" />

      <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000]/90 backdrop-blur-md text-white border-b border-red-900/30">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none" loading="eager" />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[
                { href: '/', label: 'Home' },
                { href: '/leaderboard', label: 'Leaderboards' },
                { href: '/picker', label: 'Picker' },
                { href: '/bonuses', label: 'Bonuses' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="relative group">
                  <span className="text-white hover:text-red-400 transition-colors">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Floating Items - optimized with CSS animations instead of JS */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <FloatingItem
            src="/clash/bombsugar.png"
            alt="Floating bomb"
            className="w-44 h-44 top-[25%] left-[20%] animate-floatItem"
          />
          <FloatingItem
            src="/clash/princess.png"
            alt="Floating princess"
            className="w-48 h-48 top-[35%] right-[18%] animate-floatItem"
            style={{ animationDelay: '2s' }}
          />
          <FloatingItem
            src="/clash/bombsugar.png"
            alt="Floating bomb"
            className="w-40 h-40 top-[75%] left-[22%] animate-floatItem"
            style={{ animationDelay: '4s' }}
          />
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-grow relative z-10">
          <motion.img
            src="/logo/logoZynko.webp"
            alt="ZYNKO Logo"
            className="h-24 md:h-32 mb-4 select-none pointer-events-none"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            loading="eager"
          />
          <p className="text-[#E2E2E2] text-lg md:text-xl font-medium leading-snug tracking-wide text-center drop-shadow-sm">
            csdrop.com<br />
            Leaderboards, Exclusive Bonuses & More!
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/leaderboard">
              <button className="px-8 py-2 text-white font-semibold text-sm rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide">
                LEADERBOARDS
              </button>
            </Link>
            <Link href="/bonuses">
              <button className="px-8 py-2 text-white font-semibold text-sm rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide">
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

        {/* Video Grid - conditionally rendered */}
        {showVideos && (
          <section className="w-full max-w-6xl px-4 pb-20 mt-10 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Latest YouTube Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.length === 0 && (
                <p className="text-white/60 text-sm col-span-full">
                  {error ? `Error: ${error}` : 'No videos found or failed to load.'}
                </p>
              )}
              {videos.map((video) => (
                <VideoCard key={video.snippet.resourceId.videoId} video={video} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sparkles Effect - optimized count */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
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

      {/* Footer - FIXED TYPO HERE */}
      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 relative z-10">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a
              href="https://www.youtube.com/@zynko333/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5" loading="lazy" />
            </a>

            <a
              href="https://kick.com/zynkogambles"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" loading="lazy" />
            </a>

            <a
              href="https://discord.gg/zynko"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
              <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5" loading="lazy" />
            </a>
          </div>

          <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
          <p className="text-white/50 text-xs mt-1">
            Made by <a href="https://x.com/AceSnapGFX" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">acesnap</a>
          </p>
        </div>
      </footer>
    </div>
  );
}