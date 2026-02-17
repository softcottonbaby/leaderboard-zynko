import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

// --- 1. CONFIGURATION ---
const manualCsdropPrizes = { 
  1: 400, 2: 250, 3: 150, 4: 90, 5: 60, 6: 35, 7: 15 
};

// --- 2. ANIMATED COUNTER ---
function Counter({ from = 0, to, fractionDigits = 0 }) {
  const nodeRef = useRef();
  useEffect(() => {
    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = value.toLocaleString(undefined, {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        });
      },
    });
    return () => controls.stop();
  }, [from, to, fractionDigits]);
  return <span ref={nodeRef} />;
}

// --- 3. PODIUM CARD ---
function PodiumCard({ player, position, accent, coinIcon }) {
  const isPrimary = position === 1;
  const isEmpty = player.username === "EMPTY";
  const accentColor = accent.replace(", 0.95)", ")");
  const accentGlow = accent.replace("0.95", "0.4");

  const cardSize = isPrimary ? "w-64" : "w-64 md:w-60 md:-mb-8";
  const avatarSize = isPrimary ? "w-28 h-28" : "w-24 h-24";
  const rankSize = isPrimary ? "w-10 h-10 text-lg" : "w-8 h-8 text-base";

  const cardStyle = {
    backgroundColor: "rgba(18, 26, 43, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1.5px solid rgba(255, 255, 255, 0.8)",
    boxShadow: isPrimary ? `0 0 40px ${accentGlow}` : `0 0 15px ${accentGlow}`,
  };

  const getRankStyling = (pos) => {
    switch (pos) {
      case 1: return { background: 'linear-gradient(45deg, #3b82f6, #60a5fa)', color: 'white' };
      case 2: return { background: 'linear-gradient(45deg, #e8ecf2, #b6c0d2)', color: 'black' };
      case 3: return { background: 'linear-gradient(45deg, #d99f6c, #a16b47)', color: 'white' };
      default: return {};
    }
  };

  const prizeValue = parseFloat(player.reward);

  return (
    <div className={`relative rounded-2xl ${cardSize} flex flex-col items-center justify-start p-5 transition-all duration-300 hover:-translate-y-2 ${isEmpty ? "opacity-60" : ""}`} style={cardStyle}>
      <div className={`relative mb-8 ${isPrimary ? "-mt-16" : "-mt-12"}`}>
        <img 
          src={player.avatar || "/default-avatar.png"} 
          className={`${avatarSize} rounded-full object-cover border-4 border-white/20`} 
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${rankSize} rounded-full flex items-center justify-center font-bold border-2 border-white/80`} style={getRankStyling(position)}>
          {position}
        </div>
      </div>
      <p className="font-bold text-white text-xl mb-4 truncate w-full text-center">{player.username}</p>
      <div className="w-full flex flex-col gap-3">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Wagered</p>
          <p className="text-xl font-bold text-white">
            ${player.wageredAmount > 0 ? <Counter to={player.wageredAmount} fractionDigits={2} /> : "0.00"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Prize</p>
          <p className="text-lg font-bold flex items-center justify-center gap-2" style={{ color: accentColor }}>
            {!isNaN(prizeValue) && prizeValue > 0 ? (
              <>
                <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                <span><Counter to={prizeValue} fractionDigits={0} /></span>
              </>
            ) : "–"}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- 4. PODIUM WRAPPER ---
function PodiumTop3({ players = [], accent, coinIcon }) {
  const emptyPlayer = { username: "EMPTY", avatar: "/default-avatar.png", wageredAmount: 0, reward: "-" };
  const topThree = [ players[0] || emptyPlayer, players[1] || emptyPlayer, players[2] || emptyPlayer ];

  return (
    <div className="flex flex-col items-center gap-16 md:flex-row md:justify-center md:items-end md:gap-6">
      <PodiumCard player={topThree[1]} position={2} accent={accent} coinIcon={coinIcon} />
      <PodiumCard player={topThree[0]} position={1} accent={accent} coinIcon={coinIcon} />
      <PodiumCard player={topThree[2]} position={3} accent={accent} coinIcon={coinIcon} />
    </div>
  );
}

// --- 5. MAIN LEADERBOARD ---
export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCsdrop = useCallback(async () => {
    try {
      const response = await fetch('/api/csdrop-leaderboard');
      if (!response.ok) throw new Error("API Route Failed");

      const data = await response.json();
      const rawList = data.rankings || [];

      // SORT by wager to ensure Rank 1 is first, then Map
      const formatted = rawList
        .sort((a, b) => (parseFloat(b.total) || 0) - (parseFloat(a.total) || 0))
        .map((p, index) => {
          const currentRank = p.rank ? parseInt(p.rank) : (index + 1);
          const prize = manualCsdropPrizes[currentRank];

          return {
            id: p.user?.hash_id || `user-${index}`,
            rank: currentRank,
            username: p.user?.name || "Anonymous",
            avatar: p.user?.avatar || "/default-avatar.png",
            wageredAmount: (parseFloat(p.total) || 0) / 100, // minor to major units
            reward: prize ? String(prize) : "-",
          };
        });

      setPlayers(formatted);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCsdrop();
    const intervalId = setInterval(fetchCsdrop, 15000);
    return () => clearInterval(intervalId);
  }, [fetchCsdrop]);

  useEffect(() => {
    const endDate = new Date("2026-02-28T23:59:59Z");
    const interval = setInterval(() => {
      const diff = endDate - new Date();
      if (diff <= 0) {
         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
         clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSlots = 11;
  const filledPlayers = [...players];
  while (filledPlayers.length < totalSlots) {
    const rank = filledPlayers.length + 1;
    filledPlayers.push({
      id: `empty-${rank}`, rank, username: "EMPTY", avatar: "/default-avatar.png", wageredAmount: 0,
      reward: manualCsdropPrizes[rank] ? String(manualCsdropPrizes[rank]) : "-",
    });
  }

  const accentColor = "rgba(59, 130, 246, 0.95)";
  const coin = "/csgold/app-coin-blue.webp";

  return (
    <div className="flex flex-col min-h-screen relative bg-black text-white">
      <main className="flex-grow w-full flex flex-col items-center px-4 pt-32 pb-24 z-10">
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-black/60 backdrop-blur-lg border-b border-white/5 py-5 px-10">
           <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
            <img src="/csgold/logo_csdrop.webp" alt="Logo" className="h-10" />
            <div className="space-x-8 font-bold">
              <a href="/" className="hover:text-blue-500 transition">Home</a>
              <a href="/leaderboard" className="text-blue-500">Leaderboard</a>
              <a href="/bonuses" className="hover:text-blue-500 transition">Bonuses</a>
            </div>
          </div>
        </nav>

        <section className="w-full max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
             <span className="text-blue-500">CSDROP.COM</span> LEADERBOARD
          </h2>

          <PodiumTop3 players={filledPlayers} accent={accentColor} coinIcon={coin} />

          {/* Table */}
          <div className="mt-20 overflow-x-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 uppercase text-white/50">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Player</th>
                      <th className="px-6 py-4">Wagered</th>
                      <th className="px-6 py-4">Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {filledPlayers.slice(3).map((p) => (
                    <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4">{p.rank}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.avatar} className="w-8 h-8 rounded-full" alt="" />
                          {p.username}
                        </td>
                        <td className="px-6 py-4">${p.wageredAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 font-bold text-blue-400">
                            {p.reward !== "-" ? (
                            <span className="flex items-center gap-1">
                                <img src={coin} alt="C" className="w-4 h-4"/> {p.reward}
                            </span>
                            ) : "-"}
                        </td>
                    </tr>
                    ))}
                </tbody>
              </table>
          </div>
        </section>
      </main>
    </div>
  );
}
