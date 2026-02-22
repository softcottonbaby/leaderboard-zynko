import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized icons
const KickIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M19.125 6.375H16.5L13.875 12L16.5 17.625H19.125L16.5 12L19.125 6.375ZM12.375 6.375H9.75L7.125 12L9.75 17.625H12.375L9.75 12L12.375 6.375ZM5.625 6.375H3L0.375 12L3 17.625H5.625L3 12L5.625 6.375Z" />
    </svg>
));
KickIcon.displayName = 'KickIcon';

const UserIcon = memo(({ className, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
));
UserIcon.displayName = 'UserIcon';

const TrophyIcon = memo(({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
));
TrophyIcon.displayName = 'TrophyIcon';

const ChatMessage = memo(({ msg }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex items-start gap-3 text-sm"
    >
        <UserIcon className="w-5 h-5 mt-0.5 flex-shrink-0" color={msg.color} />
        <div className="min-w-0">
            <span className="font-bold" style={{ color: msg.color }}>
                {msg.user}
            </span>
            <span className="text-white/80 ml-2 break-all">{msg.text}</span>
        </div>
    </motion.div>
));
ChatMessage.displayName = 'ChatMessage';

// KICK CHAT CONFIGURATION
const KICK_CHANNEL = 'zynkogambles'; // Your Kick channel name
const PUSHER_KEY = 'eb1d5f283081a78b974c';
const PUSHER_CLUSTER = 'us1';

export default function Picker() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const correctPassword = process.env.NEXT_PUBLIC_PICKER_PASSWORD || 'zynkoace';

    const [messages, setMessages] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isPicking, setIsPicking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [pickerKeyword, setPickerKeyword] = useState('!play');
    const [participantCount, setParticipantCount] = useState(0);
    const [debugInfo, setDebugInfo] = useState('');

    const chatEndRef = useRef(null);
    const wsRef = useRef(null);
    const messagesRef = useRef([]);
    const reconnectTimeout = useRef(null);

    useEffect(() => { messagesRef.current = messages; }, [messages]);

    // Working Kick WebSocket connection
    useEffect(() => {
        if (!isAuthenticated) return;

        let isActive = true;
        setConnectionStatus('Connecting...');
        setDebugInfo('Initializing connection...');

        const connectToKick = async () => {
            try {
                // Step 1: Get chatroom ID from Kick's API
                setDebugInfo('Fetching chatroom ID...');
                const response = await fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch channel: ${response.status}`);
                }

                const data = await response.json();
                const chatroomId = data.chatroom?.id;

                if (!chatroomId) {
                    throw new Error('No chatroom ID found in response');
                }

                setDebugInfo(`Got chatroom ID: ${chatroomId}`);
                console.log('✅ Chatroom ID:', chatroomId);

                // Step 2: Connect to Pusher
                setDebugInfo('Connecting to Pusher...');

                // Dynamic import Pusher to avoid SSR issues
                const Pusher = (await import('pusher-js')).default;

                const pusher = new Pusher(PUSHER_KEY, {
                    cluster: PUSHER_CLUSTER,
                    forceTLS: true,
                });

                wsRef.current = pusher;

                pusher.connection.bind('connected', () => {
                    if (!isActive) return;
                    setConnectionStatus('Connected');
                    setDebugInfo('Connected to chat!');
                    console.log('✅ Pusher connected');
                });

                pusher.connection.bind('disconnected', () => {
                    if (!isActive) return;
                    setConnectionStatus('Disconnected');
                    setDebugInfo('Disconnected');
                });

                pusher.connection.bind('error', (err) => {
                    console.error('Pusher error:', err);
                    if (!isActive) return;
                    setConnectionStatus('Error');
                    setDebugInfo(`Connection error: ${err.message || 'Unknown'}`);
                });

                // Subscribe to chat channel
                const channel = pusher.subscribe(`chatrooms.${chatroomId}.v2`);

                channel.bind('pusher:subscription_succeeded', () => {
                    console.log('✅ Subscribed to chat channel');
                    setDebugInfo('Subscribed to chat!');
                });

                channel.bind('pusher:subscription_error', (error) => {
                    console.error('Subscription error:', error);
                    setDebugInfo(`Subscription failed: ${error}`);
                });

                // Listen for messages
                channel.bind('App\Events\ChatMessageEvent', (data) => {
                    if (!isActive) return;

                    try {
                        const messageData = typeof data === 'string' ? JSON.parse(data) : data;

                        const newMsg = {
                            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            user: messageData.sender?.username || 'Unknown',
                            text: messageData.content || '',
                            color: messageData.sender?.identity?.color || '#00FF00',
                            timestamp: Date.now()
                        };

                        setMessages(prev => {
                            // Prevent duplicates
                            const recent = prev.slice(-3);
                            if (recent.some(m => m.user === newMsg.user && m.text === newMsg.text)) {
                                return prev;
                            }
                            return [...prev.slice(-199), newMsg];
                        });
                    } catch (e) {
                        console.error('Failed to process message:', e);
                    }
                });

                // Alternative event name (Kick might use different format)
                channel.bind('chat-message', (data) => {
                    if (!isActive) return;
                    console.log('Received chat-message:', data);
                });

            } catch (err) {
                console.error('Connection failed:', err);
                if (!isActive) return;
                setConnectionStatus('Failed');
                setDebugInfo(`Error: ${err.message}`);

                // Auto-retry after 5 seconds
                reconnectTimeout.current = setTimeout(() => {
                    if (isActive) connectToKick();
                }, 5000);
            }
        };

        connectToKick();

        return () => {
            isActive = false;
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current = null;
            }
        };
    }, [isAuthenticated]);

    // Update participant count
    useEffect(() => {
        const keyword = pickerKeyword.trim().toLowerCase();
        if (!keyword) {
            setParticipantCount(0);
            return;
        }

        const uniqueUsers = new Set(
            messages
                .filter(msg => msg.text.trim().toLowerCase() === keyword)
                .map(msg => msg.user)
        );
        setParticipantCount(uniqueUsers.size);
    }, [messages, pickerKeyword]);

    // Auto-scroll
    useEffect(() => {
        if (!isAuthenticated || messages.length === 0) return;
        requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
    }, [messages.length, isAuthenticated]);

    const handlePickWinner = useCallback(() => {
        if (isPicking) return;

        const keyword = pickerKeyword.trim().toLowerCase();
        if (!keyword) {
            setWinner({ user: 'Please set a keyword!', color: '#ff4d4d' });
            return;
        }

        const candidates = messagesRef.current
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
        const maxPicks = 25;
        const intervalId = setInterval(() => {
            picks++;
            const randomCandidate = uniqueCandidates[Math.floor(Math.random() * uniqueCandidates.length)];
            setWinner(randomCandidate);

            if (picks >= maxPicks) {
                clearInterval(intervalId);
                setIsPicking(false);
            }
        }, 80);
    }, [isPicking, pickerKeyword]);

    const handleLogin = useCallback((e) => {
        e.preventDefault();
        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect Password. Try again.');
            setPasswordInput('');
        }
    }, [passwordInput, correctPassword]);

    const AppNavbar = () => (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000]/90 backdrop-blur-md text-white border-b border-red-900/30">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
                <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" loading="eager" />
                <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
                    {[
                        { href: '/', label: 'Home' },
                        { href: '/leaderboard', label: 'Leaderboards' },
                        { href: '/bonuses', label: 'Bonuses' },
                        { href: '/picker', label: 'Picker' },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className="relative group">
                            <span className={`${item.href === '/picker' ? 'text-red-400' : 'text-white'} hover:text-red-400 transition-colors`}>
                                {item.label}
                                <span className={`absolute left-0 -bottom-1 h-[2px] ${item.href === '/picker' ? 'w-full' : 'w-0'} bg-red-500 transition-all duration-300 group-hover:w-full`}></span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );

    const AppFooter = ({ className = "" }) => (
        <footer className={`w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative ${className}`}>
            <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
                <div className="flex gap-6 mb-4">
                    <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 select-none pointer-events-none" loading="lazy" />
                    </a>
                    <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert select-none pointer-events-none" loading="lazy" />
                    </a>
                    <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 select-none pointer-events-none" loading="lazy" />
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
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none z-0" />
                <AppNavbar />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm p-8 bg-black/70 backdrop-blur-sm border border-red-800/50 rounded-2xl z-10 text-white"
                >
                    <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
                        Enter Password
                    </h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full mt-2 mb-4 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white text-center font-semibold tracking-wider focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="••••••••"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="w-full px-8 py-3 text-white font-semibold text-base rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide"
                        >
                            Login
                        </button>
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mt-4 text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                    </form>
                </motion.div>

                <AppFooter className="fixed bottom-0" />
            </div>
        );
    }

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
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none z-0" />

            <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
                <AppNavbar />

                <section className="w-full max-w-5xl px-4 text-white mt-6">
                    <h2 className="text-5xl md:text-6xl font-extrabold mb-1 text-white">
                        CHAT PICKER
                    </h2>
                    <p className="uppercase text-xs tracking-wide text-white/70 mb-12">
                        Pick a random winner from Kick chat
                    </p>

                    {/* Debug Info */}
                    {debugInfo && (
                        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg text-blue-200 text-xs font-mono">
                            {debugInfo}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Chat Column */}
                        <div className="md:col-span-2 bg-black/70 backdrop-blur-sm border border-red-800/50 rounded-2xl p-6 flex flex-col h-[600px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-left">Live Chat</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-white/50">
                                        {participantCount} participants
                                    </span>
                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                                        ${connectionStatus === 'Connected' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${connectionStatus === 'Connecting...' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                        ${connectionStatus === 'Disconnected' || connectionStatus === 'Failed' ? 'bg-red-500/20 text-red-400' : ''}
                                    `}>
                                        <span className={`w-2 h-2 rounded-full
                                            ${connectionStatus === 'Connected' ? 'bg-green-400 animate-pulse' : ''}
                                            ${connectionStatus === 'Connecting...' ? 'bg-yellow-400 animate-pulse' : ''}
                                            ${connectionStatus === 'Disconnected' || connectionStatus === 'Failed' ? 'bg-red-400' : ''}
                                        `}></span>
                                        {connectionStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-2 space-y-3 text-left scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                                }}
                            >
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <ChatMessage key={msg.id} msg={msg} />
                                    ))}
                                </AnimatePresence>
                                {messages.length === 0 && (
                                    <div className="text-white/30 text-center py-10">
                                        {connectionStatus === 'Connected' 
                                            ? 'Waiting for messages...' 
                                            : 'Connecting to chat...'}
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                                <KickIcon />
                                <span className="text-sm text-white/60">
                                    Channel: <strong className="text-white">{KICK_CHANNEL}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Picker Column */}
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
                                    {winner ? (
                                        <span 
                                            className="text-3xl font-bold truncate" 
                                            style={{ 
                                                color: winner.color,
                                                textShadow: `0 0 15px ${winner.color}66`
                                            }}
                                        >
                                            {winner.user}
                                        </span>
                                    ) : (
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
                                    className="w-full mt-2 mb-4 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white text-center font-semibold tracking-wider focus:outline-none focus:border-red-500 transition-colors"
                                    disabled={isPicking}
                                />

                                <button
                                    onClick={handlePickWinner}
                                    disabled={isPicking}
                                    className={`w-full px-8 py-3 text-white font-semibold text-base rounded-xl bg-red-600 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide
                                    ${isPicking ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isPicking ? 'Picking...' : 'DRAW WINNER'}
                                </button>
                                <p className="text-xs text-white/50 mt-4">
                                    {isPicking ? 'Selecting winner...' : (winner && winner.user !== `No users typed "${pickerKeyword}"` && winner.user !== 'Please set a keyword!' ? 'Congratulations!' : `Users who typed "${pickerKeyword}"`)}
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