import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [rainPlayers, setRainPlayers] = useState([]);
  const [clashPlayers, setClashPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('rain');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);

  // 🔴 Toggle Clash.GG availability here
  const clashEnabled = false;

  // 🟡 Manually configurable prizes for Rain.GG
  const manualRainPrizes = {
    1: 280,
    2: 180,
    3: 100,
    4: 65,
    5: 40,
    6: 25,
  };

  useEffect(() => {
    async function fetchRain() {
      try {
        const res = await fetch('https://www.betzynko.com/api/leaderboard/raingg');
        const data = await res.json();
        let players = data.players || [];

        // ✅ Apply manual prizes for Rain.GG
        players = players.map((p) => {
          if (manualRainPrizes[p.rank]) {
            return {
              ...p,
              reward: `${manualRainPrizes[p.rank]} Coins`,
            };
          }
          return p;
        });

        setRainPlayers(players);
      } catch (err) {
        console.error('Error fetching RAIN.GG leaderboard:', err);
      }
    }

    async function fetchClash() {
      try {
        const res = await fetch('https://www.betzynko.com/api/leaderboard/clash');
        const data = await res.json();
        setClashPlayers(data.players || []);
      } catch (err) {
        console.error('Error fetching CLASH.GG leaderboard:', err);
      }
    }

    fetchRain();
    if (clashEnabled) {
      fetchClash(); // ✅ only runs if enabled
    }
  }, [clashEnabled]);

  useEffect(() => {
    let endDate =
      activeTab === 'rain'
        ? new Date('2025-08-24T23:59:59Z')
        : new Date('2025-08-24T23:59:59Z');

    const interval = setInterval(() => {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        setIsEnded(true);
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsEnded(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const players = activeTab === 'rain' ? rainPlayers : clashPlayers;
  const rest = players.slice(3);

  const coinIcon = activeTab === 'rain' ? 'rain.gg/rainggcoin.svg' : '/clash/clashcoin.webp';
  const logoIcon = activeTab === 'rain' ? 'rain/raingg-icon.webp' : '/clash/clashcoin.webp';

  return (
    <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative select-none">
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-red-600 blur-[120px] opacity-20 pointer-events-none z-0" />

      <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboards' }, { href: '/bonuses', label: 'Bonuses' }].map((item) => (
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

        <div className="flex justify-center mb-10 mt-4">
          <div className="flex bg-[#1c1c1c] rounded-full p-1 shadow-inner gap-2">
            {/* RAIN tab */}
            <button
              onClick={() => setActiveTab('rain')}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 ${
                activeTab === 'rain'
                  ? 'bg-[#2e2e2e] text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <img src="rain/raingg-icon.webp" alt="rain" className="w-4 h-4 select-none pointer-events-none" />
              RAIN.GG
            </button>

            {/* CLASH tab (toggle enabled/disabled) */}
            {clashEnabled ? (
              <button
                onClick={() => setActiveTab('clash')}
                className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 ${
                  activeTab === 'clash'
                    ? 'bg-[#2e2e2e] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <img src="/clash/clashcoin.webp" alt="clash" className="w-4 h-4 select-none pointer-events-none" />
                CLASH.GG
              </button>
            ) : (
              <button
                disabled
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 text-white/40 cursor-not-allowed opacity-50"
              >
                <img src="/clash/clashcoin.webp" alt="clash" className="w-4 h-4 select-none pointer-events-none" />
                CLASH.GG
              </button>
            )}
          </div>
        </div>

        <section className="w-full max-w-5xl px-4 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-4">
            <img src={logoIcon} alt="site" className="w-10 h-10 md:w-12 md:h-12 select-none pointer-events-none" />
            <span>
              <span className="text-yellow-400">{activeTab.toUpperCase()}</span> 500 {activeTab === 'clash' ? 'GEMS' : 'COINS'} WEEKLY
            </span>
            <img src={logoIcon} alt="site" className="w-10 h-10 md:w-12 md:h-12 select-none pointer-events-none" />
          </h2>

          <p className="uppercase text-base md:text-lg tracking-wider text-white/70 mb-8 font-semibold">Leaderboard</p>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {[1, 0, 2].map((i) => players[i] && (
              <div key={i} className={`bg-[#111] rounded-xl p-5 w-36 sm:w-48 ${
                i === 0
                  ? 'animate-pulse-slow hover:scale-110 border border-yellow-500 scale-105 hover:shadow-yellow-400/30'
                  : 'hover:scale-105'
              } transition duration-300 hover:shadow-lg`}>
                <p className="text-white text-sm font-bold mb-1">#{players[i].rank}</p>
                <img src={players[i].profilePicture} alt={players[i].username} className="rounded-full w-16 h-16 mx-auto mb-2 object-cover select-none pointer-events-none" />
                <p className="text-sm font-semibold mb-1">{players[i].username}</p>
                <p className="text-xs text-white/60 mb-1">WAGERED</p>
                <p className="text-sm font-bold mb-2">${players[i].wageredAmount.toFixed(2)}</p>
                <p className="text-xs text-white/60">REWARD</p>
                <p className="text-yellow-400 text-sm font-bold flex justify-center items-center gap-1">
                  <img src={coinIcon} alt="coin" className="w-4 h-4 select-none pointer-events-none" />
                  {players[i].reward ? players[i].reward.replace('Coins', activeTab === 'clash' ? 'Gems' : 'Coins') : '-'}
                </p>
              </div>
            ))}
          </div>

          {!isEnded ? (
            <div className="bg-[#111] text-white border border-white/10 rounded-lg py-4 px-6 mb-6 max-w-md mx-auto">
              <p className="text-base font-bold mb-2">LEADERBOARD ENDS IN</p>
              <div className="flex justify-center gap-4 text-lg font-mono">
                {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                  <div key={unit} className="text-center">
                    <p>{String(timeLeft[unit]).padStart(2, '0')}</p>
                    <p className="text-xs text-white/50">{unit.toUpperCase()}</p>
                  </div>
                )).reduce((acc, el, i, arr) => acc.concat(el, i < arr.length - 1 ? <p key={`sep-${i}`}>:</p> : []), [])}
              </div>
            </div>
          ) : (
            <div className="bg-red-800/20 text-red-400 border border-red-600 rounded-lg py-3 px-5 text-sm mb-6 max-w-md mx-auto">
              <p className="font-bold">LEADERBOARD CONCLUDED</p>
              <p className="text-xs text-white/70">Check the discord for your next chance to win!</p>
            </div>
          )}

          <div className="overflow-x-auto bg-black/40 rounded-lg">
            <table className="min-w-full text-left text-sm table-auto">
              <thead className="text-white/70 border-b border-white/10">
                <tr>
                  <th className="px-4 py-2">RANK</th>
                  <th className="px-4 py-2">PLAYER</th>
                  <th className="px-4 py-2">WAGERED</th>
                  <th className="px-4 py-2">REWARD</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((player) => (
                  <tr key={player.id} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3">{player.rank}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img src={player.profilePicture} alt="avatar" className="w-6 h-6 rounded-full object-cover select-none pointer-events-none" />
                      {player.username}
                    </td>
                    <td className="px-4 py-3">${player.wageredAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-yellow-400">
                      {player.reward ? (
                        <span className="flex items-center gap-1">
                          <img src={coinIcon} alt="coin" className="w-4 h-4 select-none pointer-events-none" />
                          {player.reward.replace('Coins', activeTab === 'clash' ? 'Gems' : 'Coins')}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 select-none pointer-events-none" />
            </a>
            <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert select-none pointer-events-none" />
            </a>
            <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 select-none pointer-events-none" />
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
