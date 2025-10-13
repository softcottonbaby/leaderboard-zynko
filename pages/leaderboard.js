import PodiumTop3 from "/components/PodiumTop3";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Leaderboard() {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);
  const [activeSite, setActiveSite] = useState("csgold");

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

  // Mask username helper
  function maskUsername(name) {
    if (!name || name === "EMPTY" || name === "Anonymous") return name;
    if (name.length <= 4) return name[0] + "***" + name.slice(-1);
    return name.slice(0, 2) + "***" + name.slice(-2);
  }

  // Fetch CSGOLD leaderboard
  async function fetchCsgold() {
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
            reward: rank <= 7 ? `${manualCsgoldPrizes[rank]} Coins` : "-",
          };
        });
        setPlayers(formatted);
      } else setPlayers([]);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch CHIPS leaderboard
  async function fetchChips(promotionId = "99SRVGQMNQ1BRD10R7DLTU") {
    try {
      setLoading(true);
      const prefixed = promotionId.startsWith("promotion:")
        ? promotionId
        : `promotion:${promotionId}`;
      const res = await fetch(
        `/api/chips?promotionId=${encodeURIComponent(prefixed)}`
      );
      const result = await res.json();

      if (!res.ok || !result.success) {
        console.error("Chips fetch failed:", result);
        return setPlayers([]);
      }

      const leaderboard = Array.isArray(result.data)
        ? result.data
        : result.data?.data || [];

      const formatted = leaderboard.map((p, i) => {
        const rank = p.rank || i + 1;
        const wageredRaw = parseFloat(p.wagered || p.score || 0);
        const wagered = isNaN(wageredRaw) ? 0 : wageredRaw / 1e6;

        const prizeRaw = parseFloat(p.prize?.amount || 0);
        const prize = isNaN(prizeRaw) ? 0 : prizeRaw / 1e6;
        const prizeCurrency = p.prize?.currency?.toUpperCase() || "USDT";

        return {
          id: p.userid || `anon-${i}`,
          rank,
          username: p.player?.username || "Anonymous",
          profilePicture: p.player?.avatar || "/chips/default-avatar.png",
          wageredAmount: wagered,
          reward:
            prize > 0
              ? `${prize.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ${prizeCurrency}`
              : "-",
        };
      });

      setPlayers(formatted);
    } catch (err) {
      console.error("Error parsing Chips leaderboard:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  // Timer
  useEffect(() => {
    const endDate = new Date("2025-10-24T23:59:59Z");
    const interval = setInterval(() => {
      const diff = endDate - new Date();
      if (diff <= 0) {
        setIsEnded(true);
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    activeSite === "csgold" ? fetchCsgold() : fetchChips();
  }, [activeSite]);

  // Fill up to 9 slots
  const totalSlots = 9;
  const filledPlayers = [...players];
  for (let i = players.length + 1; i <= totalSlots; i++) {
    filledPlayers.push({
      id: `empty-${i}`,
      rank: i,
      username: "EMPTY",
      profilePicture: "/default-avatar.png",
      wageredAmount: 0,
      reward: "-",
    });
  }

  const rest = filledPlayers.slice(3);

  // UI constants
  const coin =
    activeSite === "chips"
      ? "/chips/chipsicon.svg"
      : "/csgold/coincsgold.svg";
  const rewardLabel = activeSite === "chips" ? "USDT" : "Coins";
  const siteName = activeSite === "chips" ? "CHIPS.GG" : "CSGOLD.GG";
  const accentColor =
    activeSite === "chips"
      ? "rgba(76,201,255,0.9)"
      : "rgba(255,205,60,0.95)";
  const totalPrize = activeSite === "chips" ? "2000" : "750";

  return (
    <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative select-none">
      {/* Smooth Bottom Glow */}
      <div
  className={`fixed bottom-0 left-0 w-full h-[700px] pointer-events-none z-0 transition-all duration-1000 ease-in-out ${
    activeSite === "chips" ? "animate-pulse-blue" : "animate-pulse-gold"
  }`}
  style={{
    background:
      activeSite === "chips"
        ? "radial-gradient(circle at 50% 100%, rgba(76,201,255,0.5) 0%, rgba(0,0,0,0) 80%)"
        : "radial-gradient(circle at 50% 100%, rgba(255,204,51,0.45) 0%, rgba(0,0,0,0) 80%)",
  }}
></div>




      <main className="flex-grow w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
            <img
              src="/logonavbar/zincoZ.webp"
              alt="Z Logo"
              className="h-8 md:h-10"
            />
            <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
              {[
                { href: "/", label: "Home" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/bonuses", label: "Bonuses" },
              ].map((i) => (
                <Link key={i.href} href={i.href} className="relative group">
                  <span className="text-white hover:text-red-400 transition">
                    {i.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Tabs */}
        <div className="flex justify-center mb-10 mt-4">
          <div className="flex bg-[#1c1c1c] rounded-full p-1 shadow-inner gap-2">
            {["csgold", "chips"].map((site) => (
              <div
                key={site}
                onClick={() => setActiveSite(site)}
                className={`flex items-center justify-center px-5 py-2 rounded-full cursor-pointer transition ${activeSite === site ? "bg-[#2e2e2e]" : "hover:bg-[#3a3a3a]"
                  }`}
              >
                <img
                  src={
                    site === "chips"
                      ? "/chips/chips-white.svg"
                      : "/csgold/csgold.png"
                  }
                  alt={site}
                  className={`h-6 w-auto ${site === "chips" ? "h-[17px]" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <section className="w-full max-w-5xl px-4 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex justify-center items-center gap-4">
            <img src={coin} alt="coin left" className="w-8 h-8" />
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  activeSite === "chips"
                    ? "linear-gradient(90deg, #4cc9ff, #3c8ef3, #007bff)"
                    : "linear-gradient(90deg, #ffcc33, #d4af37, #b8860b)",
              }}
            >
              {siteName}
            </span>
            {totalPrize} {rewardLabel} BI-WEEKLY
            <img src={coin} alt="coin right" className="w-8 h-8" />
          </h2>
          <p className="uppercase text-base md:text-lg tracking-wider text-white/70 mb-8 font-semibold">
            Leaderboard
          </p>

          {/* Podium Top 3 */}
          <PodiumTop3
            players={filledPlayers}
            accent={accentColor}
            rewardLabel={rewardLabel}
            iconPath={coin}
            wagerIcon={coin}
            totalPrize={totalPrize}
          />

          {/* Timer */}
          {!isEnded ? (
            <div
              className="text-white rounded-lg py-4 px-6 mb-6 max-w-md mx-auto shadow-lg backdrop-blur-sm border"
              style={{
                background:
                  activeSite === "chips"
                    ? "linear-gradient(135deg, rgba(76,201,255,0.06), rgba(0,123,255,0.12))"
                    : "linear-gradient(135deg, rgba(255,204,51,0.06), rgba(212,175,55,0.12))",
              }}
            >
              <p className="text-base font-bold mb-2">LEADERBOARD ENDS IN</p>
              <div className="flex justify-center gap-4 text-lg font-mono">
                {["days", "hours", "minutes", "seconds"].map((u) => (
                  <div key={u} className="text-center">
                    <p>{String(timeLeft[u]).padStart(2, "0")}</p>
                    <p className="text-xs text-white/50">{u.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-white border border-white/20 rounded-lg py-3 px-5 text-sm mb-6 max-w-md mx-auto shadow-lg backdrop-blur-sm">
              <p className="font-bold uppercase tracking-wide text-center">
                LEADERBOARD CONCLUDED
              </p>
              <p className="text-xs text-white/80 text-center mt-1">
                Check Discord for your next chance to win!
              </p>
            </div>
          )}

          {/* Table for 4–9 */}
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
                {rest.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t border-white/10 hover:bg-white/5 ${p.username === "EMPTY" ? "opacity-50 italic" : ""
                      }`}
                  >
                    <td className="px-4 py-3">{p.rank}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={
                          p.username === "EMPTY"
                            ? "/black.png"
                            : p.profilePicture
                        }
                        alt="avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      {p.username === "EMPTY"
                        ? "EMPTY"
                        : maskUsername(p.username)}
                    </td>
                    <td className="px-4 py-3">
                      {p.wageredAmount
                        ? `$${p.wageredAmount.toFixed(2)}`
                        : "–"}
                    </td>
                    <td className="px-4 py-3" style={{ color: accentColor }}>
                      <span className="flex items-center gap-1">
                        <img src={coin} alt="coin" className="w-4 h-4" />
                        {p.reward || "–"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 relative z-20 mt-auto">
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
              <img
                src="/icons/kick.png"
                alt="Kick"
                className="w-5 h-5 filter brightness-0 invert"
              />
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
            Made by{" "}
            <a
              href="https://x.com/AceSnapGFX"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-400"
            >
              acesnap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
