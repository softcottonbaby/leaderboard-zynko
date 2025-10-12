import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Picker() {
  const [authorized, setAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const correctPassword = "zynkotest";

  const [chatters, setChatters] = useState([]);
  const [messages, setMessages] = useState([]);
  const [winner, setWinner] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [keyword, setKeyword] = useState("");
  const messagesRef = useRef();

  // Connect to SSE when authorized
  useEffect(() => {
    if (!authorized) return;
    const es = new EventSource("/api/kick/events");

    es.onopen = () => console.log("✅ Connected to Kick event stream");
    es.onerror = (err) => console.error("❌ SSE error:", err);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const user = data.user || data?.raw?.data?.user?.username || "unknown";
        const text =
          data.text ||
          data?.raw?.data?.message ||
          data?.raw?.data?.content ||
          "";

        if (!user || !text) return;

        setChatters((prev) =>
          prev.includes(user) ? prev : [...prev, user]
        );
        setMessages((prev) => [...prev.slice(-49), { user, text }]);
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    return () => es.close();
  }, [authorized]);

  // Scroll chat window
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Pick random chatter
  const pickRandom = () => {
    const eligible = keyword
      ? chatters.filter((u) =>
          messages.some(
            (m) =>
              m.user === u &&
              m.text.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      : chatters;

    if (eligible.length === 0) {
      alert("No eligible chatters found.");
      return;
    }

    setRolling(true);
    setWinner(null);

    const interval = setInterval(() => {
      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      setWinner(pick);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final = eligible[Math.floor(Math.random() * eligible.length)];
      setWinner(final);
      setRolling(false);
    }, 3000);
  };

  // If not authorized, show password screen
  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0000] text-white">
        <h1 className="text-3xl font-bold mb-6">🔒 Enter Password</h1>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Password"
          className="px-4 py-2 rounded-lg text-black text-center mb-4"
        />
        <button
          onClick={() => {
            if (inputPassword === correctPassword) {
              setAuthorized(true);
            } else {
              alert("Incorrect password!");
            }
          }}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
        >
          Enter
        </button>
      </div>
    );
  }

  // Authorized content (Picker UI)
  return (
    <div className="flex flex-col min-h-screen bg-grid text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0000] border-b border-red-800 z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
          <img
            src="/logonavbar/zincoZ.webp"
            alt="Z Logo"
            className="h-8 md:h-10 select-none"
          />
          <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
            {[
              { href: "/", label: "Home" },
              { href: "/leaderboard", label: "Leaderboards" },
              { href: "/bonuses", label: "Bonuses" },
              { href: "/picker", label: "Picker" },
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

      {/* Main */}
      <main className="flex-grow w-full max-w-screen-xl mx-auto pt-32 px-4 flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* Chat Panel */}
        <div className="flex-1 bg-black/50 border border-red-900 rounded-2xl p-4 h-[600px] flex flex-col">
          <h2 className="text-xl font-bold mb-3 text-red-400">💬 Live Chat</h2>
          <div
            ref={messagesRef}
            className="space-y-1 text-sm overflow-y-auto flex-1 pr-2"
          >
            {messages.length === 0 ? (
              <p className="text-white/40">Waiting for chat messages...</p>
            ) : (
              messages.map((m, i) => (
                <p key={i}>
                  <span className="text-red-400 font-semibold">{m.user}: </span>
                  <span className="text-white/80">{m.text}</span>
                </p>
              ))
            )}
          </div>
        </div>

        {/* Picker Panel */}
        <div className="flex-1 bg-black/50 border border-red-900 rounded-2xl p-6 h-[600px] flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-6">🎲 Chat Picker</h1>

          <input
            type="text"
            placeholder="Enter keyword (optional)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full max-w-sm text-center px-4 py-2 rounded-lg mb-4 text-black"
          />

          <div className="h-16 flex items-center justify-center w-full bg-black/60 border border-red-800 rounded-xl overflow-hidden text-2xl font-semibold mb-6">
            {rolling ? (
              <span className="animate-pulse text-red-400">
                {winner || "Rolling..."}
              </span>
            ) : winner ? (
              <span className="text-green-400 animate-bounce">{winner}</span>
            ) : (
              <span className="text-white/60">Press Pick to start!</span>
            )}
          </div>

          <button
            onClick={pickRandom}
            disabled={chatters.length === 0 || rolling}
            className="px-10 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {rolling ? "Rolling..." : "PICK RANDOM"}
          </button>

          <p className="text-xs mt-4 text-white/50">
            {chatters.length} chatters connected
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 relative z-10 text-center text-white/70 text-xs">
        &copy; 2025 All rights reserved — Made by{" "}
        <a
          href="https://x.com/AceSnapGFX"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-red-400"
        >
          acesnap
        </a>
      </footer>
    </div>
  );
}
