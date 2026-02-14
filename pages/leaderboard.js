import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

// --- ANIMATION IDEA 3: Reusable Counter Component ---
function Counter({ from = 0, to, fractionDigits = 0 }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration: 1.2, // A slightly longer duration for a smoother feel
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


function PodiumCard({ player, position, accent, coinIcon }) {
  const isPrimary = position === 1;
  const isEmpty = player.username === "EMPTY";

  const accentColor = accent.replace(", 0.9)", ")");
  const accentGlow = accent.replace("0.9", "0.4");

  const cardSize = isPrimary ? "w-64" : "w-64 md:w-60 md:-mb-8";
  const avatarSize = isPrimary ? "w-28 h-28" : "w-24 h-24";
  const rankSize = isPrimary ? "w-10 h-10 text-lg" : "w-8 h-8 text-base";

  const cardStyle = {
    backgroundColor: "rgba(18, 26, 43, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1.5px solid rgba(255, 255, 255, 0.8)",
    boxShadow: isPrimary
      ? `0 0 40px ${accentGlow}`
      : `0 0 15px ${accentGlow}`,
  };

  if (accent.includes("255,205,60")) {
    cardStyle.backgroundColor = "rgba(40, 30, 10, 0.4)";
  }

  const getRankStyling = (pos) => {
    switch (pos) {
      case 1: return { background: 'linear-gradient(45deg, #fce570, #efb418)', color: 'black', boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)' };
      case 2: return { background: 'linear-gradient(45deg, #e8ecf2, #b6c0d2)', color: 'black', boxShadow: '0 0 15px rgba(192, 192, 192, 0.6)' };
      case 3: return { background: 'linear-gradient(45deg, #d99f6c, #a16b47)', color: 'white', textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)', boxShadow: '0 0 15px rgba(205, 127, 50, 0.6)' };
      default: return {};
    }
  };

  const rankBadgeStyle = getRankStyling(position);
  
  // Logic for parsing prize value for the counter
  const prizeValue = parseFloat(player.reward);
  const prizeUnit = player.reward?.split(' ').slice(1).join(' ');

  return (
    <div
      className={`relative rounded-2xl ${cardSize} flex flex-col items-center justify-start p-5 transition-all duration-300 hover:-translate-y-2 ${isEmpty ? "opacity-60" : ""}`}
      style={cardStyle}
    >
      <div className={`relative mb-8 ${isPrimary ? "-mt-16" : "-mt-12"}`}>
        {/* --- MODIFIED BORDER CHECK --- */}
        <div className={`rounded-full p-[3px]`} style={{ border: `3px solid ${accent.includes("255,205,60") ? "rgba(255, 205, 60, 0.7)" : "rgba(76, 201, 255, 0.7)"}` }}>
          <img src={player.avatar || player.profilePicture || "/default-avatar.png"} alt={isEmpty ? "Empty Slot" : `${player.username}'s avatar`} className={`${avatarSize} rounded-full object-cover border-2 border-white/50`} onError={(e) => (e.target.src = "/default-avatar.png")} />
        </div>
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${rankSize} rounded-full flex items-center justify-center font-bold border-2 border-white/80`} style={rankBadgeStyle}>
          {position}
        </div>
      </div>

      <p className="font-bold text-white text-xl mb-4 tracking-wide truncate w-full px-2">{player.username}</p>

      <div className="w-full flex flex-col gap-3">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Wagered</p>
          <p className="text-xl font-bold text-white">
            {player.wageredAmount && player.wageredAmount > 0 ? (
              <>
                $<Counter to={player.wageredAmount} fractionDigits={2} />
              </>
            ) : "–"}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Prize</p>
          <p className="text-lg font-bold flex items-center justify-center gap-2" style={{ color: accentColor }}>
            {player.reward && !isNaN(prizeValue) && prizeValue > 0 ? (
              <>
                <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                <span>
                  <Counter to={prizeValue} fractionDigits={prizeUnit === 'USDT' ? 2 : 0} /> {prizeUnit}
                </span>
              </>
            ) : "–"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PodiumTop3({ players = [], accent, coinIcon }) {
  const emptyPlayer = { username: "EMPTY", avatar: "/default-avatar.png", wageredAmount: null, reward: null };
  const topThree = [ players[0] || emptyPlayer, players[1] || emptyPlayer, players[2] || emptyPlayer ];

  const podiumVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" } }),
  };

  return (
    <div className="flex flex-col items-center gap-16 md:flex-row md:justify-center md:items-end md:gap-6">
      <motion.div custom={0} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-2">
        <PodiumCard player={topThree[0]} position={1} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      <motion.div custom={1} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-1">
        <PodiumCard player={topThree[1]} position={2} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      <motion.div custom={2} initial="hidden" animate="visible" variants={podiumVariants} className="md:order-3">
        <PodiumCard player={topThree[2]} position={3} accent={accent} coinIcon={coinIcon} />
      </motion.div>
    </div>
  );
}

// --- MOVED PRIZES OUTSIDE COMPONENT ---
const manualCsgoldPrizes = {
  1: 300,
  2: 175,
  3: 100,
  4: 75,
  5: 50,
  6: 25,
  7: 15,
  8: 10
};


export default function Leaderboard() {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [activeSite, setActiveSite] = useState("csgold"); 

  function maskUsername(name) {
    if (!name || name === "EMPTY" || name === "Anonymous") return name;
    if (name.length <= 4) return name[0] + "***" + name.slice(-1);
    return name.slice(0, 2) + "***" + name.slice(-2);
  }

  // --- WRAP IN useCallback ---
  const fetchCsgold = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/csgold");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((p, index) => {
          const rank = index + 1;
          return {
            id: (p.username || "anon") + rank,
            rank,
            username: p.isAnon ? "Anonymous" : p.username || "Anonymous",
            profilePicture: p.avatar || "/default-avatar.png",
            wageredAmount: parseFloat(p.totalAmount || 0),
            reward: rank <= 8 ? `${manualCsgoldPrizes[rank]} Coins` : "-",
          };
        });
        setPlayers(formatted);
      } else setPlayers([]);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as manualCsgoldPrizes is now a stable constant

  // --- WRAP IN useCallback ---
  const fetchChips = useCallback(async (promotionId = "99SRVGQMNQ1BRD10R7DLTU") => {
    try {
      setLoading(true);
      setPlayers([]);
    } catch (err) {
      console.error("Error parsing Chips leaderboard:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  // --- MODIFIED TIMER LOGIC ---
  useEffect(() => {
    let endDate;
    
    if (activeSite === "csgold") {
      // CSGOLD: Ends November 9, 2025 (as requested)
      endDate = new Date("2025-11-09T23:59:59Z");
    } else {
      // CHIPS: Keeps original timer (October 26, 2025 from user's code)
      endDate = new Date("2025-10-26T20:59:25Z");
    }

    const interval = setInterval(() => {
      const diff = endDate - new Date();
      if (diff <= 0) {
        setIsEnded(true);
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Set to 0
      } else {
        setIsEnded(false); // Ensure it's not ended
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSite]); 
  // --- END OF MODIFICATION ---

  // --- REPLACED useEffect FOR AUTO-REFRESH ---
  useEffect(() => {
    const fetchData = () => {
      if (activeSite === "csgold") {
        fetchCsgold();
      } else {
        // fetchChips() // Add this back when ready to implement chips
        setPlayers([]); // Default to empty
      }
    };

    fetchData(); // Fetch data immediately on load/site change
    
    const intervalId = setInterval(fetchData, 10000); // Set interval to refetch every 10 seconds

    return () => clearInterval(intervalId); // Clear interval on cleanup
    
  }, [activeSite, fetchCsgold, fetchChips]); // Add useCallback functions to dependency array
  // --- END OF REPLACEMENT ---

  // Limit leaderboard to 11 total slots max
const totalSlots = 11;

// Trim players if there are too many
const limitedPlayers = players.slice(0, totalSlots);

// --- MODIFIED LOGIC TO FILL EMPTY SLOTS WITH PRIZES ---
// Fill up with EMPTY slots if fewer than 11
const filledPlayers = [...limitedPlayers];
if (filledPlayers.length < totalSlots) {
  for (let i = filledPlayers.length; i < totalSlots; i++) {
    const rank = i + 1; // Get the rank for this empty slot
    let emptyReward = "-"; // Default reward

    // Check if it's csgold and if this rank has a defined prize
    if (activeSite === "csgold" && manualCsgoldPrizes[rank]) {
      emptyReward = `${manualCsgoldPrizes[rank]} Coins`;
    }

    filledPlayers.push({
      id: `empty-${rank}`,
      rank: rank,
      username: "EMPTY",
      profilePicture: "/default-avatar.png",
      wageredAmount: 0,
      reward: emptyReward, // Use the new reward variable
    });
  }
}
// --- END OF MODIFICATION ---



  const rest = filledPlayers.slice(3);

  const coin = activeSite === "chips" ? "/chips/chipsicon.svg" : "/csgold/coincsgold.svg";
  const rewardLabel = activeSite === "chips" ? "USDT" : "Coins";
  const siteName = activeSite === "chips" ? "CHIPS.GG" : "CSGOLD.GG";
  const accentColor = activeSite === "chips" ? "rgba(76,201,255,0.9)" : "rgba(255,205,60,0.95)";
  const totalPrize = activeSite === "chips" ? "2000" : "750";
  
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative select-none bg-black">
      <AnimatePresence>
        {activeSite === "chips" && ( <motion.div key="chips-bg" className="absolute inset-0 w-full h-full z-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: "easeInOut" }} style={{ backgroundColor: "#080c18", backgroundImage: `linear-gradient(to right, rgba(76, 201, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(76, 201, 255, 0.1) 1px, transparent 1px)`, backgroundSize: "35px 35px" }} /> )}
        {/* --- GOLD THEME CHANGE --- */}
        {activeSite === "csgold" && ( <motion.div key="csgold-bg" className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-gold-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: "easeInOut" }} style={{ backgroundImage: `linear-gradient(to right, rgba(255, 205, 60, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 205, 60, 0.1) 1px, transparent 1px)`, backgroundSize: "35px 35px" }} /> )}
      </AnimatePresence>

      {/* --- GOLD THEME CHANGE --- */}
      <div className={`fixed bottom-0 left-0 w-full h-[700px] pointer-events-none z-0 transition-all duration-1000 ease-in-out ${activeSite === "chips" ? "animate-pulse-blue" : "animate-pulse-gold"}`} style={{ background: activeSite === "chips" ? "radial-gradient(circle at 50% 100%, rgba(76,201,255,0.5) 0%, rgba(0,0,0,0) 80%)" : "radial-gradient(circle at 50% 100%, rgba(255,204,51,0.55) 0%, rgba(0,0,0,0) 80%)" }}></div>

      <main className="flex-grow w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10" />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[{ href: "/", label: "Home" }, { href: "/leaderboard", label: "Leaderboard" }, { href: "/bonuses", label: "Bonuses" }].map((i) => (
                <a key={i.href} href={i.href} className="relative group">
                  <span className="text-white hover:text-red-400 transition">
                    {i.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* --- MODIFIED Site Switcher (Chips.gg removed) --- */}
        <div className="flex justify-center mb-10 mt-4">
         {["csgold"].map((site) => {
  const isDisabled = false; 
  return (
    <div
      key={site}
      onClick={() => !isDisabled && setActiveSite(site)}
      className={`relative flex items-center justify-center px-5 py-2 rounded-full transition-colors duration-150 ${
        isDisabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer hover:bg-[#3a3a3a]"
      }`}
      title={isDisabled ? "Coming soon!" : ""}
    >
      {!isDisabled && activeSite === site && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[#2e2e2e] rounded-full"
          style={{ zIndex: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      <img
        src={site === "chips" ? "/chips/chips-white.svg" : "/csgold/csgold.png"}
        alt={site}
        className={`relative h-6 w-auto ${site === "chips" ? "h-[17px]" : ""} ${
          isDisabled ? "grayscale" : ""
        }`}
        style={{ zIndex: 1 }}
      />
    </div>
  );
})}
        </div>
        {/* --- END OF Site Switcher --- */}


        <AnimatePresence mode="wait">
          {loading ? ( <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center h-[400px] w-full">
              <motion.div className={`w-16 h-16 border-4 rounded-full ${activeSite === "chips" ? "border-t-transparent border-blue-400 border-blue-200" : "border-t-transparent border-yellow-400 border-yellow-200" }`} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
              <p className="mt-6 text-white/70 font-semibold tracking-wide text-lg">Loading {activeSite.toUpperCase()} leaderboard...</p>
            </motion.div>
          ) : (
            <motion.section key={activeSite} initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -30 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-5xl px-4 text-white">
              <p
                className="text-center font-bold mb-6 uppercase text-sm tracking-wider"
                style={{ color: accentColor, textShadow: `0 0 10px ${accentColor.replace('0.9', '0.4').replace('0.95', '0.4')}` }}
              >
                WAGER ABUSING GETS YOU DISQUALIFIED FROM LEADERBOARD AND REWARDS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 flex justify-center items-center gap-4">
                <img src={coin} alt="" className="w-8 h-8" />
                {/* --- GOLD THEME CHANGE --- */}
                <span className="font-bold bg-clip-text text-transparent animated-gradient" style={{ backgroundImage: activeSite === "chips" ? "linear-gradient(90deg, #4cc9ff, #3c8ef3, #007bff)" : "linear-gradient(90deg, #fff8e1, #ffcc33, #d4af37, #ffcc33, #fff8e1)" }}>
                  {siteName}
                </span>
                {totalPrize} {rewardLabel} BI-WEEKLY
                <img src={coin} alt="" className="w-8 h-8" />
              </h2>
              <p className="uppercase text-base md:text-lg tracking-wider text-white/70 mb-8 font-semibold">Leaderboard</p>

              <motion.div className="mt-12 mb-12" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <PodiumTop3 players={filledPlayers} accent={accentColor} coinIcon={coin} />
              </motion.div>

              {/* --- START: Modified Original Timer --- */}
              {!isEnded ? (
                <div 
                  className={`text-white rounded-lg py-4 px-6 mb-6 max-w-md mx-auto shadow-lg backdrop-blur-sm border ${
                    activeSite === "csgold" ? "bg-gold-timer border-gold-timer" : ""
                  }`}
                  style={activeSite === "chips" ? { 
                    borderColor: "rgba(76, 201, 255, 0.2)", 
                    background: "linear-gradient(135deg, rgba(76,201,255,0.06), rgba(0,123,255,0.12))" 
                  } : {}}
                >
                  <p className="text-base font-bold mb-3 text-center">LEADERBOARD ENDS IN</p>
                  <div className="flex justify-center gap-3 text-lg font-mono">
                    {["days", "hours", "minutes", "seconds"].map((u) => (
                      <div 
                        key={u} 
                        className={`
                          text-center rounded-lg px-3 py-1 
                          ${activeSite === "csgold" 
                            ? "bg-black/30 border border-gold-faint" 
                            : "bg-black/30 border border-white/20"
                          }
                        `}
                      >
                        <p className="text-xl font-bold">{String(timeLeft[u]).padStart(2, "0")}</p>
                        <p className="text-xs text-white/50">{u.toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : ( 
                <div className="text-white border border-white/20 rounded-lg py-3 px-5 text-sm mb-6 max-w-md mx-auto shadow-lg backdrop-blur-sm">
                  <p className="font-bold uppercase tracking-wide text-center">LEADERBOARD CONCLUDED</p>
                  <p className="text-xs text-white/80 text-center mt-1">Check Discord for your next chance to win!</p>
                </div>
              )}
              {/* --- END: Modified Original Timer --- */}


              <div className="overflow-x-auto bg-black/40 rounded-lg transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <table className="min-w-full text-left text-sm table-auto">
                  {/* --- GOLD THEME CHANGE --- */}
                  <thead className={`text-white/70 border-b ${activeSite === "csgold" ? "border-gold-faint" : "border-white/10"}`}>
                    <tr>
                      <th className="px-4 py-2">RANK</th>
                      <th className="px-4 py-2">PLAYER</th>
                      <th className="px-4 py-2">WAGERED</th>
                      <th className="px-4 py-2">REWARD</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={listContainerVariants} initial="hidden" animate="visible">
                    {rest.map((p) => {
                      const rewardValue = parseFloat(p.reward);
                      const rewardUnit = p.reward?.split(' ').slice(1).join(' ');
                      return (
                        /* --- GOLD THEME CHANGE --- */
                        <motion.tr key={p.id} variants={listItemVariants} className={`border-t ${activeSite === "csgold" ? "border-gold-faint hover:bg-gold-faint" : "border-white/10 hover:bg-white/5"} ${p.username === "EMPTY" ? "opacity-50 italic" : ""}`}>
                          <td className="px-4 py-3">{p.rank}</td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <img src={p.username === "EMPTY" ? "/black.png" : p.profilePicture} alt={p.username !== "EMPTY" ? `${p.username}'s avatar` : ""} className="w-6 h-6 rounded-full object-cover"/>
                            {p.username === "EMPTY" ? "EMPTY" : maskUsername(p.username)}
                          </td>
                          <td className="px-4 py-3">
                            {p.wageredAmount > 0 ? (
                              <>
                                $<Counter to={p.wageredAmount} fractionDigits={2} />
                              </>
                            ) : "–"}
                          </td>
                          <td className="px-4 py-3" style={{ color: accentColor }}>
                            <span className="flex items-center gap-1 font-semibold">
                              {p.reward !== "-" && !isNaN(rewardValue) && rewardValue > 0 ? (
                                <>
                                  <img src={coin} alt="" className="w-4 h-4" />
                                  <Counter to={rewardValue} fractionDigits={rewardUnit === 'USDT' ? 2 : 0} /> {rewardUnit}
                                </>
                              ) : (p.reward !== "-" ? p.reward : "–")}
                            </span>
                          </td>
                        </motion.tr>
                      )})}
                  </motion.tbody>
                </table>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 relative z-20 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="flex gap-6 mb-4">
            <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5" />
            </a>
            <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" aria-label="Kick" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert" />
            </a>
            <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5" />
            </a>
          </div>
          <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
          <p className="text-white/50 text-xs mt-1">
            Made by{" "}
            <a href="https.com/AceSnapGFX" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">
              acesnap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}