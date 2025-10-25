import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Pusher from 'pusher-js'; // Import Pusher

// --- Helper Icons ---
const KickIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M19.125 6.375H16.5L13.875 12L16.5 17.625H19.125L16.5 12L19.125 6.375ZM12.375 6.375H9.75L7.125 12L9.75 17.625H12.375L9.75 12L12.375 6.375ZM5.625 6.375H3L0.375 12L3 17.625H5.625L3 12L5.625 6.375Z" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const TrophyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
);
// --- End Helper Icons ---


export default function Picker() {
    // --- Password State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const correctPassword = 'zynkoace';
    // --- End Password State ---

    const [messages, setMessages] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isPicking, setIsPicking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [pickerKeyword, setPickerKeyword] = useState('!play');
    const chatEndRef = useRef(null);

    // --- Real Kick Chat Connection ---
    useEffect(() => {
        // Only run if authenticated
        if (!isAuthenticated) return;

        setConnectionStatus('Connecting...');
        
        console.log("Attempting to fetch /api/kick...");
        fetch('/api/kick')
            .then(res => {
                if (!res.ok) {
                    console.error('Fetch /api/kick failed:', res.status);
                    throw new Error(`Failed to fetch API route (status: ${res.status})`);
                }
                console.log("Fetch /api/kick successful.");
                return res.json();
            })
            .then(data => {
                const chatroomId = data.chatroomId;
                if (!chatroomId) {
                    console.error('Chatroom ID not found in API response:', data);
                    setConnectionStatus('Error: Could not find chatroom');
                    return;
                }

                console.log(`Got chatroom ID: ${chatroomId}. Connecting to Pusher...`);

                const pusher = new Pusher('eb1d5f283081a78b974c', { cluster: 'us1', forceTLS: true });
                const channel = pusher.subscribe(`chat-room.${chatroomId}`);
                
                pusher.connection.bind('state_change', (states) => {
                    console.log("Pusher connection state changed:", states);
                });

                pusher.connection.bind('connected', () => {
                    console.log("Pusher connection successful!");
                    setConnectionStatus('Connected');
                });
                pusher.connection.bind('error', (err) => {
                    console.error('Pusher connection error:', err);
                    setConnectionStatus('Connection Error');
                    if (err.error && err.error.data) {
                        console.error('Pusher error details:', err.error.data);
                    }
                });

                channel.bind('ChatMessageEvent', (data) => {
                    try {
                        const message = JSON.parse(data.data);
                        setMessages(prev => [
                            ...prev.slice(-100),
                            {
                                id: message.id,
                                user: message.sender.username,
                                text: message.content,
                                color: message.sender.identity.color || '#FFFFFF'
                            }
                        ]);
                    } catch (e) {
                        console.error("Failed to parse chat message:", e);
                    }
                });

                return () => {
                    pusher.unsubscribe(`chat-room.${chatroomId}`);
                    pusher.disconnect();
                };
            })
            .catch(err => {
                console.error('Failed to connect to Kick chat:', err);
                setConnectionStatus('Failed to connect');
            });

    }, [isAuthenticated]); // This effect now depends on isAuthenticated


    // Scroll to bottom of chat when new messages arrive
    useEffect(() => {
        if (!isAuthenticated) return;
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAuthenticated]);

    // --- Picker Logic ---
    const handlePickWinner = () => {
        if (isPicking) return;
        const keyword = pickerKeyword.trim().toLowerCase();
        if (!keyword) {
             setWinner({ user: 'Please set a keyword!', color: '#ff4d4d' });
             return;
        }

        const candidates = messages
            .filter(msg => msg.text.trim().toLowerCase() === keyword)
            .map(msg => ({ user: msg.user, color: msg.color }));
        
        const uniqueCandidates = Array.from(new Map(candidates.map(c => [c.user, c])).values());

        if (uniqueCandidates.length === 0) {
            setWinner({ user: `No users typed "${keyword}"`, color: '#ff4d4d' });
            return;
        }

        setIsPicking(true);
        setWinner(null);

        let picks = 0;
        const maxPicks = 20 + Math.floor(Math.random() * 10);
        const pickInterval = setInterval(() => {
            picks++;
            const randomCandidate = uniqueCandidates[Math.floor(Math.random() * uniqueCandidates.length)];
            setWinner(randomCandidate);

            if (picks >= maxPicks) {
                clearInterval(pickInterval);
                setIsPicking(false);
            }
        }, 100);
    };

    // --- Login Handler ---
    const handleLogin = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect Password. Try again.');
            setPasswordInput('');
        }
    };

    // --- Navbar Component ---
    const AppNavbar = () => (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
                <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" />
                <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
                    {[
                        { href: '/', label: 'Home' },
                        { href: '/leaderboard', label: 'Leaderboards' },
                        { href: '/bonuses', label: 'Bonuses' },
                        { href: '/picker', label: 'Picker' },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className="relative group">
                            <span className={`${item.href === '/picker' ? 'text-red-400' : 'text-white'} hover:text-red-400 transition`}>
                                {item.label}
                                <span className={`absolute left-0 -bottom-1 h-[2px] ${item.href === '/picker' ? 'w-full' : 'w-0'} bg-red-500 transition-all duration-300 group-hover:w-full`}></span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );

    // --- Footer Component ---
    const AppFooter = ({ className = "" }) => (
        <footer className={`w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative ${className}`}>
            <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
                <div className="flex gap-6 mb-4">
                    <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 select-none pointer-events-none" />
                    </a>
                    <a href="https://kick.com/zynkogles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert select-none pointer-events-none" />
                    </a>
                    <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 select-none pointer-events-none" />
                    </a>
                </div>
                <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
                <p className="text-white/50 text-xs mt-1">
                    Made by{' '}
                    <a href="https://x.com/AceSnapGFX" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">
                        acesnap
                    </a>
                </p>
            </div>
        </footer>
    );


    // --- RENDER LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen bg-[#0a0000] overflow-x-hidden relative select-none items-center justify-center"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 80, 80, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 80, 80, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "35px 35px",
                }}
            >
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-red-500 blur-3xl opacity-20 pointer-events-none z-0" />
                <AppNavbar />

                <div className="w-full max-w-sm p-8 bg-black/70 backdrop-blur-sm border border-red-800/50 rounded-2xl z-10 text-white">
                    <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
                        Enter Password
                    </h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full mt-2 mb-4 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white text-center font-semibold tracking-wider"
                            placeholder="••••••••"
                        />
                        <button
                            type="submit"
                            className="w-full px-8 py-3 text-white font-semibold text-base rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3),inset_0_0_3px_rgba(255,80,80,0.2)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide"
                        >
                            Login
                        </button>
                        {error && (
                            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                        )}
                    </form>
                </div>
                
                <AppFooter className="fixed bottom-0" />
            </div>
        );
    }

    // --- RENDER PICKER PAGE (If authenticated) ---
    return (
        <div className="flex flex-col min-h-screen bg-[#0a0000] overflow-x-hidden relative select-none"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(255, 80, 80, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 80, 80, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "35px 35px",
            }}
        >
            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-red-500 blur-3xl opacity-20 pointer-events-none z-0" />

            <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
                <AppNavbar />

                {/* Picker Content */}
                <section className="w-full max-w-5xl px-4 text-white mt-6">
                    <h2 className="text-5xl md:text-6xl font-extrabold mb-1 text-white">
                        CHAT PICKER
                    </h2>
                    <p className="uppercase text-xs tracking-wide text-white/70 mb-12">
                        Pick a random winner from Kick chat
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* --- Chat Column --- */}
                        <div className="md:col-span-2 bg-black/70 backdrop-blur-sm border border-red-800/50 rounded-2xl p-6 flex flex-col h-[600px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-left">Live Chat</h3>
                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                                    ${connectionStatus === 'Connected' ? 'bg-green-500/20 text-green-400' : ''}
                                    ${connectionStatus === 'Connecting...' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                    ${connectionStatus.includes('Error') || connectionStatus.includes('Failed') ? 'bg-red-500/20 text-red-400' : ''}
                                `}>
                                    <span className={`w-2 h-2 rounded-full
                                        ${connectionStatus === 'Connected' ? 'bg-green-400 animate-pulse' : ''}
                                        ${connectionStatus === 'Connecting...' ? 'bg-yellow-400 animate-pulse' : ''}
                                        ${connectionStatus.includes('Error') || connectionStatus.includes('Failed') ? 'bg-red-400' : ''}
                                    `}></span>
                                    {connectionStatus}
                                </span>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-2 space-y-3 text-left"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                                }}
                            >
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            layout
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                            className="flex items-start gap-3 text-sm"
                                        >
                                            <UserIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: msg.color }} />
                                            <div>
                                                <span className="font-bold" style={{ color: msg.color }}>
                                                    {msg.user}
                                                </span>
                                                <span className="text-white/80 ml-2 break-all">{msg.text}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={chatEndRef} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                                <KickIcon />
                                <span className="text-sm text-white/60">
                                    Connected to <strong className="text-white">zynkogambles</strong> chat
                                </span>
                            </div>
                        </div>

                        {/* --- Picker Column --- */}
                        <div className="md:col-span-1 bg-black/70 backdrop-blur-sm border border-red-800/50 rounded-2xl p-6 flex flex-col items-center justify-between h-[600px]">
                            
                            <div className="w-full text-center">
                                <TrophyIcon className="w-16 h-16 text-red-400 mb-6 mx-auto" />
                                <h3 className="text-2xl font-bold mb-4">Winner</h3>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={winner ? winner.user : 'waiting'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-24 flex items-center justify-center text-center px-4"
                                >
                                    {winner && (
                                        <span 
                                            className="text-3xl font-bold truncate" 
                                            style={{ 
                                                color: winner.color,
                                                textShadow: `0 0 15px ${winner.color}66`
                                            }}
                                        >
                                            {winner.user}
                                        </span>
                                    )}
                                    {!winner && (
                                        <span className="text-2xl text-white/50">
                                            Click to draw
                                        </span>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="w-full">
                                <label className="text-xs uppercase text-white/50 tracking-wide">
                                    Picker Keyword
                                </label>
                                <input
                                    type="text"
                                    value={pickerKeyword}
                                    onChange={(e) => setPickerKeyword(e.target.value)}
                                    className="w-full mt-2 mb-4 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white text-center font-semibold tracking-wider"
                                />

                                <button
                                    onClick={handlePickWinner}
                                    disabled={isPicking}
                                    className={`w-full px-8 py-3 text-white font-semibold text-base rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3),inset_0_0_3px_rgba(255,80,80,0.2)] hover:scale-105 active:scale-95 active:brightness-110 transition duration-200 tracking-wide
                                    ${isPicking ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                                >
                                    {isPicking ? 'Picking...' : 'DRAW WINNER'}
                                </button>
                                <p className="text-xs text-white/50 mt-4">
                                    {isPicking ? 'Rerolling...' : (winner ? 'Congratulations to the winner!' : `Picks a user who typed "${pickerKeyword}"`)}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            
            <AppFooter />
        </div>
    );
}


