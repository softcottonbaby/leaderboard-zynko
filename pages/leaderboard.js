import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- SITE CONFIGURATION ---
const SITES = {
  ruxbet: {
    id: 'ruxbet',
    name: 'Ruxbet',
    logo: '/ruxbet/ruxbetlogo.png',
    apiEndpoint: '/api/ruxbet-leaderboard', // Your proxy endpoint
    campaignCode: 'zynko', // Campaign code to filter by
    prizes: { 1: 250, 2: 125, 3: 60, 4: 30, 5: 15, 6: 10, 7: 5 },
    accentColor: 'rgba(0, 255, 47, 0.95)',
    coinIcon: '/ruxbet/usdcoin.png',
    totalPrize: '500',
    theme: 'green'
  }
};

const Counter = memo(({ from = 0, to, fractionDigits = 0, duration = 1000 }) => {
  const [value, setValue] = useState(from);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * easeOut;
      setValue(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [from, to, duration]);

  return <span>{value.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}</span>;
});
Counter.displayName = 'Counter';

const PodiumCard = memo(({ player, position, accent, coinIcon, theme }) => {
  const isPrimary = position === 1;
  const isEmpty = !player || player.username === "EMPTY";
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
    const gradients = { 
      blue: { 1: '#3b82f6', 2: '#60a5fa', 3: '#93c5fd' }, 
      green: { 1: '#00ff22', 2: '#00ff26', 3: '#6ee7b7' },
      red: { 1: '#ef4444', 2: '#f87171', 3: '#fca5a5' }
    };
    const colors = gradients[theme] || gradients.green;
    switch (pos) {
      case 1: return { background: `linear-gradient(45deg, ${colors[1]}, ${colors[2]})`, color: 'white', boxShadow: `0 0 15px ${colors[1]}66` };
      case 2: return { background: `linear-gradient(45deg, #e8ecf2, #b6c0d2)`, color: 'black', boxShadow: '0 0 15px rgba(192, 192, 192, 0.6)' };
      case 3: return { background: `linear-gradient(45deg, #d99f6c, #a16b47)`, color: 'white', textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)', boxShadow: '0 0 15px rgba(205, 127, 50, 0.6)' };
      default: return {};
    }
  };

  const prizeValue = player ? parseFloat(player.reward) : 0;

  return (
    <div className={`relative rounded-2xl ${cardSize} flex flex-col items-center justify-start p-5 transition-all duration-300 hover:-translate-y-2 ${isEmpty ? "opacity-60" : ""}`} style={cardStyle}>
      <div className={`relative mb-8 ${isPrimary ? "-mt-16" : "-mt-12"}`}>
        <div className="rounded-full p-[3px]" style={{ border: `3px solid ${accentColor}99` }}>
          <img src={player?.avatar || "/default-avatar.png"} alt="avatar" className={`${avatarSize} rounded-full object-cover border-2 border-white/50`} loading="lazy" onError={(e) => (e.target.src = "/default-avatar.png")} />
        </div>
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${rankSize} rounded-full flex items-center justify-center font-bold border-2 border-white/80`} style={getRankStyling(position)}>
          {position}
        </div>
      </div>
      <p className="font-bold text-white text-xl mb-4 tracking-wide truncate w-full px-2 text-center">{player?.username || "EMPTY"}</p>
      <div className="w-full flex flex-col gap-3">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Wagered</p>
          <p className="text-xl font-bold text-white">{player?.wageredAmount > 0 ? <>$<Counter to={player.wageredAmount} fractionDigits={2} /></> : "–"}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Prize</p>
          <p className="text-lg font-bold flex items-center justify-center gap-2" style={{ color: accentColor }}>
            {!isNaN(prizeValue) && prizeValue > 0 ? <><img src={coinIcon} alt="Coin" className="w-5 h-5" loading="lazy" /><span><Counter to={prizeValue} fractionDigits={0} /></span></> : "–"}
          </p>
        </div>
      </div>
    </div>
  );
});
PodiumCard.displayName = 'PodiumCard';

const PodiumTop3 = memo(({ players = [], accent, coinIcon, theme }) => {
  const topThree = [players[1], players[0], players[2]];
  return (
    <div className="flex flex-col items-center gap-16 md:flex-row md:justify-center md:items-end md:gap-6">
      <PodiumCard player={topThree[0]} position={2} accent={accent} coinIcon={coinIcon} theme={theme} />
      <PodiumCard player={topThree[1]} position={1} accent={accent} coinIcon={coinIcon} theme={theme} />
      <PodiumCard player={topThree[2]} position={3} accent={accent} coinIcon={coinIcon} theme={theme} />
    </div>
  );
});
PodiumTop3.displayName = 'PodiumTop3';

const SiteTab = memo(({ site, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`relative transition-all duration-300 group flex flex-col items-center gap-2
        ${isActive ? 'scale-105' : 'hover:scale-102'}`}
    >
      <div 
        className={`relative w-32 h-16 md:w-40 md:h-20 rounded-xl overflow-hidden bg-black/50 transition-all duration-300 flex items-center justify-center
          ${isActive 
            ? 'ring-2 ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
            : 'ring-1 ring-white/10 opacity-60 hover:opacity-90'
          }`}
      >
        <img 
          src={site.logo} 
          alt={site.name} 
          className="w-full h-full object-contain p-2"
          loading="lazy" 
          onError={(e) => { 
            e.target.style.display = 'none'; 
            e.target.parentElement.querySelector('.fallback').style.display = 'flex'; 
          }} 
        />
        <div className="fallback absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center hidden">
          <span className="text-2xl font-bold text-white/50">{site.name.charAt(0)}</span>
        </div>
        
        {isActive && (
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ 
              background: `linear-gradient(135deg, ${site.accentColor.replace('0.95', '0.3')} 0%, transparent 50%)` 
            }}
          />
        )}
      </div>

      <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>
        {site.name}
      </span>

      {isActive && (
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: site.accentColor.replace('0.95', '1') }}
        />
      )}
    </button>
  );
});
SiteTab.displayName = 'SiteTab';

export default function Leaderboard() {
  const [activeSiteId, setActiveSiteId] = useState('ruxbet');
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [endDate, setEndDate] = useState(null); // Dynamic end date from API

  const activeSite = SITES[activeSiteId];
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!activeSite) return;
    try {
      const response = await fetch(activeSite.apiEndpoint);
      
      if (!response.ok) {
        console.warn(`API error for ${activeSiteId}: HTTP ${response.status}`);
        setPlayers([]);
        setError(null);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      let processedPlayers = [];
      
      if (activeSiteId === 'ruxbet') {
        // API returns: { name, endsAt, standings: [{position, username, wageredUsd, prizeUsd}] }
        const standings = data.standings || [];
        
        // Update end date from API
        if (data.endsAt) {
          setEndDate(data.endsAt);
        }
        
        processedPlayers = standings.map((p) => ({
          id: `ruxbet-${p.position}-${p.username || 'anon'}`,
          username: p.username || "Anonymous",
          avatar: "/default-avatar.png",
          wageredAmount: parseFloat(p.wageredUsd) || 0,
          rank: p.position, // API uses 'position', not 'rank'
          reward: p.prizeUsd !== null && p.prizeUsd !== undefined ? `${p.prizeUsd}` : "-"
        }));
      } else {
        // Generic handler for future sites
        const rawList = data.rankings || data.standings || [];
        processedPlayers = rawList.map((p, idx) => ({
          id: p.user?.hash_id || p.username || `temp-${idx}`,
          username: p.user?.name || p.username || "Anonymous",
          avatar: p.user?.avatar || "/default-avatar.png",
          wageredAmount: parseFloat(p.total || p.wageredUsd) / (p.total ? 100 : 1),
          rank: p.position || idx + 1
        }));
        
        processedPlayers.sort((a, b) => b.wageredAmount - a.wageredAmount);
        processedPlayers = processedPlayers.map((p, index) => {
          const currentRank = index + 1;
          return {
            ...p,
            rank: currentRank,
            id: p.id.startsWith('temp-') ? `user-${currentRank}-${Date.now()}` : p.id,
            reward: activeSite.prizes[currentRank] ? `${activeSite.prizes[currentRank]}` : "-"
          };
        });
      }
      
      setPlayers(processedPlayers);
      setError(null);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
      setPlayers([]);
      setError(null);
    } finally { 
      setLoading(false); 
    }
  }, [activeSite, activeSiteId]);

  useEffect(() => { 
    setLoading(true); 
    setPlayers([]); 
    fetchLeaderboard(); 
    intervalRef.current = setInterval(fetchLeaderboard, 60000);
    return () => { 
      if (intervalRef.current) clearInterval(intervalRef.current); 
    }; 
  }, [fetchLeaderboard, activeSiteId]);

  useEffect(() => {
    // Use API endDate if available, otherwise fallback to static config
    const targetDate = endDate || activeSite?.endDate;
    if (!targetDate) return;
    
    const endDateObj = new Date(targetDate);
    const updateCountdown = () => {
      const diff = endDateObj - new Date();
      if (diff <= 0) { 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
        if (countdownRef.current) clearInterval(countdownRef.current); 
        return; 
      }
      setTimeLeft({ 
        days: Math.floor(diff / 86400000), 
        hours: Math.floor((diff / 3600000) % 24), 
        minutes: Math.floor((diff / 60000) % 60), 
        seconds: Math.floor((diff / 1000) % 60) 
      });
    };
    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);
    return () => { 
      if (countdownRef.current) clearInterval(countdownRef.current); 
    };
  }, [endDate, activeSite?.endDate]); // Depend on dynamic endDate

  const filledPlayers = useMemo(() => {
    const totalSlots = 11;
    const combined = [...players].sort((a, b) => a.rank - b.rank);
    const finalBoard = [];
    for (let i = 1; i <= totalSlots; i++) {
      const existingPlayer = combined.find(p => Number(p.rank) === i);
      if (existingPlayer) finalBoard.push(existingPlayer);
      else finalBoard.push({ 
        id: `empty-${i}-${activeSiteId}`, 
        rank: i, 
        username: "EMPTY", 
        avatar: "/default-avatar.png", 
        wageredAmount: 0, 
        reward: activeSite?.prizes[i] ? `${activeSite.prizes[i]}` : "-" 
      });
    }
    return finalBoard;
  }, [players, activeSiteId, activeSite]);

  const handleSiteChange = useCallback((siteId) => { 
    if (siteId === activeSiteId) return; 
    setActiveSiteId(siteId); 
  }, [activeSiteId]);
  
  if (!activeSite) return null;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative select-none bg-black">
      <div className="absolute top-0 left-0 w-full h-[850px] pointer-events-none z-0 transition-all duration-1000" style={{ background: `radial-gradient(circle at 50% -20%, ${activeSite.accentColor.replace('0.95', '0.25')} 0%, ${activeSite.accentColor.replace('0.95', '0.1')} 40%, ${activeSite.accentColor.replace('0.95', '0.03')} 65%, rgba(0,0,0,0) 90%)` }} />
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20 transition-all duration-1000" style={{ backgroundImage: `linear-gradient(to right, ${activeSite.accentColor.replace('0.95', '0.1')} 1px, transparent 1px), linear-gradient(to bottom, ${activeSite.accentColor.replace('0.95', '0.1')} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <main className="flex-grow w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-black/60 backdrop-blur-lg text-white border-b border-white/5 py-5 px-6 md:px-10">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
            <img src="/logonavbar/zincoZ.webp" alt="Logo" className="h-8 md:h-10" loading="eager" />
            <div className="space-x-8 text-sm font-bold tracking-wide">{[{ href: "/", label: "Home" }, { href: "/leaderboard", label: "Leaderboard" }, { href: "/bonuses", label: "Bonuses" }].map((i) => (<a key={i.href} href={i.href} className="text-white hover:text-[#3b82f6] transition-colors">{i.label}</a>))}</div>
          </div>
        </nav>

        <section className="w-full max-w-5xl px-4 text-white">
          <div className="mb-10">
            <p className="text-center text-xs uppercase tracking-wider text-white/50 mb-4">Select Leaderboard</p>
            <div className="flex justify-center gap-4 md:gap-6 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-fit mx-auto flex-wrap">
              {Object.values(SITES).map((site) => (
                <SiteTab 
                  key={site.id} 
                  site={site} 
                  isActive={activeSiteId === site.id} 
                  onClick={() => handleSiteChange(site.id)} 
                />
              ))}
            </div>
          </div>

          <p className="text-center font-bold mb-6 uppercase text-sm tracking-wider" style={{ color: activeSite.accentColor }}>WAGER ABUSING GETS YOU DISQUALIFIED FROM REWARDS</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 flex justify-center items-center gap-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${activeSite.accentColor.replace('0.95', '1')}, ${activeSite.accentColor.replace('0.95', '0.6')}, ${activeSite.accentColor.replace('0.95', '1')})` }}>{activeSite.name.toUpperCase()}</span>
            <span className="text-white/80">{activeSite.totalPrize} BALANCE BI-WEEKLY</span>
          </h2>

          {loading && <div className="flex justify-center items-center py-20"><div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" /></div>}
          {error && !loading && <div className="text-red-400 py-8 bg-red-900/20 rounded-xl border border-red-500/30 mb-8">Error loading leaderboard: {error}</div>}

          {!loading && <motion.div key={activeSiteId} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mt-12 mb-12"><PodiumTop3 players={filledPlayers} accent={activeSite.accentColor} coinIcon={activeSite.coinIcon} theme={activeSite.theme} /></motion.div>}

          <motion.div key={`timer-${activeSiteId}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white bg-black/60 border rounded-xl py-6 px-10 mb-12 max-w-md mx-auto backdrop-blur-md transition-colors duration-500" style={{ borderColor: activeSite.accentColor.replace('0.95', '0.2') }}>
            <p className="text-xs font-bold mb-3 uppercase tracking-widest text-center" style={{ color: activeSite.accentColor }}>Leaderboard Ends In</p>
            <div className="flex justify-center gap-5 text-2xl font-mono">{["days", "hours", "minutes", "seconds"].map(u => (<div key={u} className="text-center"><p className="font-bold">{String(timeLeft[u]).padStart(2, '0')}</p><p className="text-[10px] text-white/40 uppercase">{u}</p></div>))}</div>
          </motion.div>

          {!loading && <motion.div key={`table-${activeSiteId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="overflow-x-auto bg-black/40 rounded-lg border backdrop-blur-sm shadow-2xl transition-colors duration-500" style={{ borderColor: activeSite.accentColor.replace('0.95', '0.1') }}>
            <table className="min-w-full text-left text-sm">
              <thead className="text-white/50 border-b" style={{ borderColor: activeSite.accentColor.replace('0.95', '0.1') }}><tr><th className="px-6 py-4">RANK</th><th className="px-6 py-4">PLAYER</th><th className="px-6 py-4">WAGERED</th><th className="px-6 py-4">REWARD</th></tr></thead>
              <tbody>{filledPlayers.slice(3).map((p, idx) => (<motion.tr key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={`border-t border-white/5 hover:bg-opacity-5 transition-colors ${p.username === "EMPTY" ? "opacity-40 italic" : ""}`}><td className="px-6 py-4">{p.rank}</td><td className="px-6 py-4 flex items-center gap-3"><img src={p.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" loading="lazy" onError={(e) => (e.target.src = "/default-avatar.png")} />{p.username}</td><td className="px-6 py-4 text-white/80">${p.wageredAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td><td className="px-6 py-4 font-bold" style={{ color: activeSite.accentColor.replace('0.95', '1') }}>{p.reward !== "-" ? <span className="flex items-center gap-1"><img src={activeSite.coinIcon} alt="C" className="w-4 h-4" loading="lazy" /> {p.reward}</span> : "-"}</td></motion.tr>))}</tbody>
            </table>
          </motion.div>}
        </section>
      </main>

      <footer className="w-full bg-[#0a0a0a] border-t border-[#3b82f6]/20 pt-8 pb-6 relative z-20 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a href="https://www.youtube.com/@zynko333/featured " target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all"><img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 filter brightness-0 invert" loading="lazy" /></a>
            <a href="https://kick.com/zynkogambles " target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all"><img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" loading="lazy" /></a>
            <a href="https://discord.gg/zynko " target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center hover:bg-[#3b82f6]/30 transition-all"><img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 filter brightness-0 invert" loading="lazy" /></a>
          </div>
          <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}