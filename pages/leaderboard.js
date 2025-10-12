import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [activeSite, setActiveSite] = useState('csgold');

  // Manual prizes for CSGOLD
  const manualCsgoldPrizes = {
    1: 300,
    2: 200,
    3: 100,
    4: 50,
    5: 25,
    6: 15,
    7: 10,
  };

  // 🟡 Fetch CSGOLD leaderboard
  async function fetchCsgold() {
    try {
      const res = await fetch('/api/csgold');
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((p, index) => {
          const rank = index + 1;
          return {
            id: p.username + rank,
            rank,
            username: p.isAnon ? 'Anonymous' : p.username,
            profilePicture: p.avatar,
            wageredAmount: parseFloat(p.totalAmount || 0),
            reward: `${manualCsgoldPrizes[rank] || 0} Coins`,
          };
        });
        setPlayers(formatted);
      } else {
        console.error('Failed to fetch CSGOLD.GG leaderboard:', result);
      }
    } catch (err) {
      console.error('Error fetching CSGOLD.GG leaderboard:', err);
    }
  }

  // 🧩 Fetch CHIPS.GG leaderboard (now forces fetch even without ID)
  async function fetchChips() {
    try {
      const promotionId = ''; // ⚠️ put real ID here later

      if (!promotionId) {
        console.warn('⚠️ No CHIPS.GG promotion ID, testing request anyway.');
      }

      const res = await fetch(
        `https://api.chips.gg/prod/api/public/getPromotionLeaderboard?promotionid=${promotionId}`
      );

      console.log('Fetching Chips.gg leaderboard…');

      const data = await res.json();
      console.log('Response:', data);

      if (Array.isArray(data?.leaderboard)) {
        const formatted = data.leaderboard.map((p, i) => ({
          id: p.username + i,
          rank: p.rank || i + 1,
          username: p.username || 'Anonymous',
          profilePicture: p.avatarUrl || '/chips/default-avatar.png',
          wageredAmount: parseFloat(p.volume || 0),
          reward: `${p.rewardAmount || 0} Chips`,
        }));
        setPlayers(formatted);
      } else {
        console.log('CHIPS.GG leaderboard empty or invalid.');
        setPlayers([]);
      }
    } catch (err) {
      console.error('Error fetching CHIPS.GG leaderboard:', err);
    }
  }

  // ⏱ Countdown timer
  useEffect(() => {
    let endDate = new Date('2025-10-24T23:59:59Z');
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
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🧩 Fetch leaderboard depending on site
  useEffect(() => {
    if (activeSite === 'csgold') fetchCsgold();
    if (activeSite === 'chips') fetchChips();
  }, [activeSite]);

  const rest = players.slice(3);
  const coin = activeSite === 'chips' ? '/chips/chipsicon.png' : '/csgold/coincsgold.svg';
  const logo = activeSite === 'chips' ? '/chips/chips.png' : '/csgold/csgold.png';
  const currency = activeSite === 'chips' ? 'CHIPS' : 'COINS';
  const siteName = activeSite === 'chips' ? 'CHIPS.GG' : 'CSGOLD.GG';

  return (
    <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative select-none">
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-red-600 blur-[120px] opacity-20 pointer-events-none z-0" />

      <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10" />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboard' }, { href: '/bonuses', label: 'Bonuses' }].map((item) => (
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

        {/* Tab Bar */}
        <div className="flex justify-center mb-10 mt-4">
          <div className="flex bg-[#1c1c1c] rounded-full p-1 shadow-inner gap-2">
            {/* CSGOLD */}
            <div
              onClick={() => setActiveSite('csgold')}
              className={`flex items-center justify-center px-5 py-2 rounded-full transition cursor-pointer ${activeSite === 'csgold' ? 'bg-[#2e2e2e]' : 'hover:bg-[#3a3a3a]'
                }`}
            >
              <img src="/csgold/csgold.png" alt="CSGOLD.GG" className="h-6 md:h-8 w-auto" />
            </div>

            {/* CHIPS */}
            <div
              onClick={() => setActiveSite('chips')}
              className={`flex items-center justify-center px-5 py-2 rounded-full transition cursor-pointer ${activeSite === 'chips' ? 'bg-[#2e2e2e]' : 'hover:bg-[#3a3a3a]'
                }`}
            >
              <img
                src="/chips/chips-white.svg"
                alt="CHIPS.GG"
                className="h-[15px] md:h-[17px] w-auto select-none pointer-events-none object-contain"
              />
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <section className="w-full max-w-5xl px-4 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex justify-center items-center gap-4">
            <img src={coin} alt="coin left" className="w-8 h-8 md:w-10 md:h-10" />
            <span>
              <span className="text-yellow-400">{siteName}</span> 750 {currency} BI-WEEKLY
            </span>
            <img src={coin} alt="coin right" className="w-8 h-8 md:w-10 md:h-10" />
          </h2>

          <p className="uppercase text-base md:text-lg tracking-wider text-white/70 mb-8 font-semibold">
            Leaderboard
          </p>

          {/* Timer */}
          {!isEnded ? (
            <div className="bg-[#111] text-white border border-white/10 rounded-lg py-4 px-6 mb-6 max-w-md mx-auto">
              <p className="text-base font-bold mb-2">LEADERBOARD ENDS IN</p>
              <div className="flex justify-center gap-4 text-lg font-mono">
                {['days', 'hours', 'minutes', 'seconds']
                  .map((unit) => (
                    <div key={unit} className="text-center">
                      <p>{String(timeLeft[unit]).padStart(2, '0')}</p>
                      <p className="text-xs text-white/50">{unit.toUpperCase()}</p>
                    </div>
                  ))
                  .reduce(
                    (acc, el, i, arr) => acc.concat(el, i < arr.length - 1 ? <p key={`sep-${i}`}>:</p> : []),
                    []
                  )}
              </div>
            </div>
          ) : (
            <div className="bg-red-800/20 text-red-400 border border-red-600 rounded-lg py-3 px-5 text-sm mb-6 max-w-md mx-auto">
              <p className="font-bold">LEADERBOARD CONCLUDED</p>
              <p className="text-xs text-white/70">Check the discord for your next chance to win!</p>
            </div>
          )}

          {/* Table */}
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
                {players.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-white/60">
                      No leaderboard data yet — check back soon!
                    </td>
                  </tr>
                ) : (
                  rest.map((player) => (
                    <tr
                      key={player.id}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-4 py-3">{player.rank}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <img src={player.profilePicture} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                        {player.username}
                      </td>
                      <td className="px-4 py-3">${player.wageredAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-yellow-400">
                        <span className="flex items-center gap-1">
                          <img src={coin} alt="coin" className="w-4 h-4" />
                          {player.reward.replace('Coins', currency)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5" />
            </a>
            <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" />
            </a>
            <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition">
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
