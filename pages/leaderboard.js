import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

// --- 1. CONFIGURATION ---
const CONFIG = {
  API_URL: "https://api.csdrop.com/v1/leaderboard",
  PUBLIC_KEY: "IJnsemuVsOqzpaLirMzGwhQbcGedfh",
  PRIVATE_KEY: "eNpecoKkLYFKfmiEqncYKjFbabhfOh" 
};

// --- 2. PRIZE POOL ---
const manualCsdropPrizes = { 
  1: 400, 2: 250, 3: 150, 4: 90, 5: 60, 6: 35, 7: 15 
};

// --- 3. ANIMATED COUNTER ---
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

// --- 4. PODIUM CARD ---
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
      case 1: return { background: 'linear-gradient(45deg, #3b82f6, #60a5fa)', color: 'white', boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' };
      case 2: return { background: 'linear-gradient(45deg, #e8ecf2, #b6c0d2)', color: 'black', boxShadow: '0 0 15px rgba(192, 192, 192, 0.6)' };
      case 3: return { background: 'linear-gradient(45deg, #d99f6c, #a16b47)', color: 'white', textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)', boxShadow: '0 0 15px rgba(205, 127, 50, 0.6)' };
      default: return {};
    }
  };

  const prizeValue = parseFloat(player.reward);

  return (
    <div className={`relative rounded-2xl ${cardSize} flex flex-col items-center justify-start p-5 transition-all duration-300 hover:-translate-y-2 ${isEmpty ? "opacity-60" : ""}`} style={cardStyle}>
      <div className={`relative mb-8 ${isPrimary ? "-mt-16" : "-mt-12"}`}>
        <div className="rounded-full p-[3px]" style={{ border: `3px solid rgba(59, 130, 246, 0.6)` }}>
          <img src={player.avatar || "/default-avatar.png"} alt="avatar" className={`${avatarSize} rounded-full object-cover border-2 border-white/50`} onError={(e) => (e.target.src = "/default-avatar.png")} />
        </div>
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${rankSize} rounded-full flex items-center justify-center font-bold border-2 border-white/80`} style={getRankStyling(position)}>
          {position}
        </div>
      </div>
      <p className="font-bold text-white text-xl mb-4 tracking-wide truncate w-full px-2 text-center">{player.username}</p>
      <div className="w-full flex flex-col gap-3">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Wagered</p>
          <p className="text-xl font-bold text-white">
            {player.wageredAmount > 0 ? <>$<Counter to={player.wageredAmount} fractionDigits={2} /></> : "–"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Prize</p>
          <p className="text-lg font-bold flex items-center justify-center gap-2" style={{ color: accentColor }}>
            {player.reward && !isNaN(prizeValue) && prizeValue > 0 ? (
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

// --- 5. PODIUM WRAPPER ---
function PodiumTop3({ players = [], accent, coinIcon }) {
  // Always ensure we have at least 3 objects to render, even if empty
  const emptyPlayer = { username: "EMPTY", avatar: "/default-avatar.png", wageredAmount: 0, reward: null };
  const topThree = [ players[0] || emptyPlayer, players[1] || emptyPlayer, players[2] || emptyPlayer ];

  const podiumVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" } }),
  };

  return (
    <div className="flex flex-col items-center gap-16 md:flex-row md:justify-center md:items-end md:gap-6">
      {/* 2nd Place */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-1">
        <PodiumCard player={topThree[1]} position={2} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      {/* 1st Place */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-2">
        <PodiumCard player={topThree[0]} position={1} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      {/* 3rd Place */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-3">
        <PodiumCard player={topThree[2]} position={3} accent={accent} coinIcon={coinIcon} />
      </motion.div>
    </div>
  );
}

// --- 6. MAIN LEADERBOARD ---
export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true); 

// Inside pages/leaderboard.js
const fetchCsdrop = useCallback(async () => {
  try {
    const response = await fetch('/api/csdrop-leaderboard'); // Must match the filename exactly
    if (!response.ok) throw new Error("API Route Failed");

    const data = await response.json();
    const rawList = data.rankings || []; // Match the key from the API response above

    const formatted = rawList.map((p, index) => ({
      id: (p.username || "anon") + (index + 1),
      rank: index + 1,
      username: p.username || "Anonymous",
      avatar: p.avatar || "/default-avatar.png",
      wageredAmount: parseFloat(p.wager || 0),
      reward: manualCsdropPrizes[index + 1] ? `${manualCsdropPrizes[index + 1]}` : "-",
    }));

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

  // Timer
  useEffect(() => {
    // Hardcode specific end date for display
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

  // --- FORCE FILL EMPTY SLOTS ---
  // This runs regardless of API success/failure so the board is NEVER blank
  const totalSlots = 11;
  const filledPlayers = [...players];
  while (filledPlayers.length < totalSlots) {
    const rank = filledPlayers.length + 1;
    filledPlayers.push({
      id: `empty-${rank}`, rank, username: "EMPTY", avatar: "/default-avatar.png", wageredAmount: 0,
      reward: manualCsdropPrizes[rank] ? `${manualCsdropPrizes[rank]}` : "-",
    });
  }

  const accentColor = "rgba(59, 130, 246, 0.95)";
  const coin = "/csgold/app-coin-blue.webp";
  
  const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const listItemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative select-none bg-black">
      {/* Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[850px] pointer-events-none z-0" style={{ background: "radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.25) 0%, rgba(30, 64, 175, 0.1) 40%, rgba(29, 78, 216, 0.03) 65%, rgba(0,0,0,0) 90%)" }} />
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <main className="flex-grow w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-black/60 backdrop-blur-lg text-white border-b border-white/5">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/csgold/logo_csdrop.webp" alt="CSDrop Logo" className="h-8 md:h-10" />
            
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[{ href: "/", label: "Home" }, { href: "/leaderboard", label: "Leaderboard" }, { href: "/bonuses", label: "Bonuses" }].map((i) => (
                <a key={i.href} href={i.href} className="relative group">
                  <span className="text-white hover:text-[#3b82f6] transition">{i.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#3b82f6] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <section className="w-full max-w-5xl px-4 text-white">
          <p className="text-center font-bold mb-6 uppercase text-sm tracking-wider" style={{ color: accentColor }}>WAGER ABUSING GETS YOU DISQUALIFIED FROM REWARDS</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 flex justify-center items-center gap-4">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#3b82f6]">CSDROP.COM</span> 1,000 BALANCE BI-WEEKLY
          </h2>

          {/* ALWAYS RENDER THE BOARD, NO LOADING OR ERROR STATES BLOCKING IT */}
          <motion.div className="mt-12 mb-12" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <PodiumTop3 players={filledPlayers} accent={accentColor} coinIcon={coin} />
          </motion.div>

          <div className="text-white bg-black/60 border border-[#3b82f6]/20 rounded-xl py-6 px-10 mb-12 max-w-md mx-auto backdrop-blur-md">
              <p className="text-xs font-bold mb-3 text-[#3b82f6] uppercase tracking-widest text-center">Leaderboard Ends In</p>
              <div className="flex justify-center gap-5 text-2xl font-mono">
              {["days", "hours", "minutes", "seconds"].map(u => (
                  <div key={u} className="text-center">
                  <p className="font-bold">{String(timeLeft[u]).padStart(2, '0')}</p>
                  <p className="text-[10px] text-white/40 uppercase">{u}</p>
                  </div>
              ))}
              </div>
          </div>

          <div className="overflow-x-auto bg-black/40 rounded-lg border border-[#3b82f6]/10 backdrop-blur-sm shadow-2xl">
              <table className="min-w-full text-left text-sm">
              <thead className="text-white/50 border-b border-[#3b82f6]/10">
                  <tr><th className="px-6 py-4">RANK</th><th className="px-6 py-4">PLAYER</th><th className="px-6 py-4">WAGERED</th><th className="px-6 py-4">REWARD</th></tr>
              </thead>
              <motion.tbody variants={listContainerVariants} initial="hidden" animate="visible">
                  {filledPlayers.slice(3).map((p) => (
                  <motion.tr key={p.id} variants={listItemVariants} className={`border-t border-white/5 hover:bg-[#3b82f6]/5 transition-colors ${p.username === "EMPTY" ? "opacity-40 italic" : ""}`}>
                      <td className="px-6 py-4">{p.rank}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" onError={(e) => (e.target.src = "/default-avatar.png")} />
                      {p.username}
                      </td>
                      <td className="px-6 py-4 text-white/80">${p.wageredAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 font-bold text-[#3b82f6]">
                          {p.reward !== "-" ? (
                          <span className="flex items-center gap-1">
                              <img src={coin} alt="C" className="w-4 h-4"/> {p.reward}
                          </span>
                          ) : "-"}
                      </td>
                  </motion.tr>
                  ))}
              </motion.tbody>
              </table>
          </div>

        </section>
      </main>

      <footer className="w-full bg-[#0a0a0a] border-t border-[#3b82f6]/20 pt-8 pb-6 relative z-20 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all">
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 filter brightness-0 invert" />
            </a>
            <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all">
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" />
            </a>
            <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all">
              <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 filter brightness-0 invert" />
            </a>
          </div>
          <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}