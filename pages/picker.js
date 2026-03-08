import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const KickIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
        <path d="M19.125 6.375H16.5L13.875 12L16.5 17.625H19.125L16.5 12L19.125 6.375ZM12.375 6.375H9.75L7.125 12L9.75 17.625H12.375L9.75 12L12.375 6.375ZM5.625 6.375H3L0.375 12L3 17.625H5.625L3 12L5.625 6.375Z" />
    </svg>
));
KickIcon.displayName = 'KickIcon';

const TrophyIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black">
        <path d="M5 3h14v2H5V3m0 16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3H5v3m14-8h-2V7h-2v4H9V7H7v4H5v2h2v4h2v-4h6v4h2v-4h2v-2z"/>
    </svg>
));
TrophyIcon.displayName = 'TrophyIcon';

const SettingsIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
));
SettingsIcon.displayName = 'SettingsIcon';

const UsersIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
));
UsersIcon.displayName = 'UsersIcon';

const CheckIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
));
CheckIcon.displayName = 'CheckIcon';

const HashIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
));
HashIcon.displayName = 'HashIcon';

const DiamondIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
        <path d="M12 2L2 12l10 10L22 12 12 2z"/>
    </svg>
));
DiamondIcon.displayName = 'DiamondIcon';

const BanIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
));
BanIcon.displayName = 'BanIcon';

const ClockIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
));
ClockIcon.displayName = 'ClockIcon';

const UnlockIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
));
UnlockIcon.displayName = 'UnlockIcon';

const TestTubeIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
        <path d="M14.5 2v17.5c0 1.7-1.3 3-3 3s-3-1.3-3-3V2"></path>
        <path d="M8.5 2h7"></path>
        <path d="M14.5 8h-5"></path>
    </svg>
));
TestTubeIcon.displayName = 'TestTubeIcon';

const TrashIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
));
TrashIcon.displayName = 'TrashIcon';

// --- ANIMATED BACKGROUND ---
const AnimatedBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/30 to-black animate-pulse" style={{ animationDuration: '4s' }} />
        <motion.div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-red-600/20 to-red-900/20 blur-[120px]" animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ top: '-20%', left: '-10%' }} />
        <motion.div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-red-800/20 to-black blur-[100px]" animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} style={{ bottom: '-10%', right: '-5%' }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)`, backgroundSize: '50px 50px' }} />
        <motion.div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
    </div>
);

// --- EMOTE PARSER ---
const parseEmotes = (text) => {
    if (!text) return [];
    const parts = [];
    const regex = /\[emote:(\d+):([^\]]+)\]/g;
    let lastIndex = 0, match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        parts.push({ type: 'emote', id: match[1], name: match[2], url: `https://files.kick.com/emotes/${match[1]}/fullsize` });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });
    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

// --- KICK REAL BADGE IMAGES ---
// Uses Kick's actual badge CDN. Subscriber badges use their count (months/tier).
const getKickBadgeUrl = (badge) => {
    if (!badge) return null;
    const type = (badge.type || '').toLowerCase();

    // Subscriber badges include a count for tier/months
    if (type === 'subscriber' || type === 'sub') {
        const count = badge.count || 1;
        return `https://files.kick.com/channel_subscriber_badges/${count}/BADGE_IMAGE`;
    }

    const badgeMap = {
        broadcaster: 'https://static.kick.com/images/badges/broadcaster/BADGE_IMAGE',
        moderator:   'https://static.kick.com/images/badges/moderator/BADGE_IMAGE',
        vip:         'https://static.kick.com/images/badges/vip/BADGE_IMAGE',
        og:          'https://static.kick.com/images/badges/og/BADGE_IMAGE',
        founder:     'https://static.kick.com/images/badges/founder/BADGE_IMAGE',
        verified:    'https://static.kick.com/images/badges/verified/BADGE_IMAGE',
        admin:       'https://static.kick.com/images/badges/admin/BADGE_IMAGE',
        sub_gifter:  'https://static.kick.com/images/badges/sub_gifter/BADGE_IMAGE',
        staff:       'https://static.kick.com/images/badges/staff/BADGE_IMAGE',
    };

    return badgeMap[type] || null;
};

const KickBadge = memo(({ badge }) => {
    const [imgError, setImgError] = useState(false);
    if (!badge) return null;

    const url = getKickBadgeUrl(badge);

    if (url && !imgError) {
        return (
            <img
                src={url}
                alt={badge.text || badge.type}
                title={badge.text || badge.type}
                className="inline-block w-4 h-4 align-middle"
                loading="lazy"
                onError={() => setImgError(true)}
            />
        );
    }

    // Fallback text pill
    return (
        <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold uppercase leading-none bg-gray-600 text-white">
            {badge.text || badge.type}
        </span>
    );
});
KickBadge.displayName = 'KickBadge';

// --- AVATAR CACHE + FETCH QUEUE (module-level) ---
const avatarCache = new Map();
const avatarFetchQueue = new Set();

/**
 * Fetches a Kick user's avatar via the public channel API.
 * Results are stored in avatarCache keyed by lowercase username.
 * Returns the avatar URL string or null.
 */
const fetchKickAvatar = async (username) => {
    const key = username.toLowerCase();
    if (avatarCache.has(key)) return avatarCache.get(key);
    if (avatarFetchQueue.has(key)) return null;

    avatarFetchQueue.add(key);
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(key)}`, {
            headers: { 'Accept': 'application/json' },
            credentials: 'omit',
        });
        if (res.ok) {
            const data = await res.json();
            let avatar =
                data.user?.profile_pic ||
                data.user?.profilepic   ||
                data.user?.profile_picture ||
                data.user?.avatar ||
                null;

            if (avatar) {
                if (avatar.startsWith('//')) avatar = 'https:' + avatar;
                avatarCache.set(key, avatar);
                return avatar;
            }
        }
    } catch {
        // silently fail — fallback to initials
    } finally {
        avatarFetchQueue.delete(key);
    }
    // Cache null so we don't keep retrying
    avatarCache.set(key, null);
    return null;
};

// --- USER AVATAR ---
const UserAvatar = memo(({ src, alt, className }) => {
    const [imgSrc, setImgSrc]   = useState(null);
    const [error, setError]     = useState(false);

    useEffect(() => {
        setError(false);
        if (!src) { setImgSrc(null); return; }
        let url = src;
        if (url.startsWith('//')) url = 'https:' + url;
        setImgSrc(url);
    }, [src]);

    const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : '?');

    if (error || !imgSrc) {
        return (
            <div className={`${className} bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/10`}>
                {getInitials(alt)}
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`${className} object-cover`}
            loading="lazy"
            onError={() => setError(true)}
        />
    );
});
UserAvatar.displayName = 'UserAvatar';

const Emote = memo(({ url, name }) => (
    <img src={url} alt={name} className="inline-block w-5 h-5 align-middle mx-0.5" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
));
Emote.displayName = 'Emote';

const ChatMessage = memo(({ msg, isEntry }) => {
    const contentParts = parseEmotes(msg.text);
    return (
        <motion.div layout initial={{ opacity: 0, x: -20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`flex items-start gap-2 text-sm py-1.5 px-2 rounded-lg ${isEntry ? 'bg-gradient-to-r from-red-500/20 to-transparent border-l-2 border-red-500' : 'hover:bg-white/5'}`}>
            <UserAvatar src={msg.avatar} alt={msg.user} className="w-7 h-7 rounded-full flex-shrink-0 ring-2 ring-white/10" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                    {isEntry && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500 text-xs font-bold">+</motion.span>}
                    <span className="font-bold text-sm" style={{ color: msg.color }}>{msg.user}</span>
                    {msg.badges?.map((b, i) => <KickBadge key={i} badge={b} />)}
                </div>
                <div className="text-white/80 text-sm break-words">
                    {contentParts.map((p, i) => p.type === 'emote' ? <Emote key={i} url={p.url} name={p.name} /> : <span key={i}>{p.content}</span>)}
                </div>
            </div>
        </motion.div>
    );
});
ChatMessage.displayName = 'ChatMessage';

// --- SLOT MACHINE ---
const startedRolls = new Set();

const SlotMachineWheel = memo(({ isRolling, candidates, finalWinner, onComplete, rollKey }) => {
    const containerRef = useRef(null);
    const stripRef     = useRef(null);

    const [displayItems, setDisplayItems]           = useState([]);
    const [animState, setAnimState]                 = useState('idle');
    const [isWinnerHighlighted, setIsWinnerHighlighted] = useState(false);

    const ITEM_WIDTH      = 120;
    const GAP             = 14;
    const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP;

    useEffect(() => {
        if (!isRolling || !finalWinner) return;
        if (startedRolls.has(rollKey)) return;
        startedRolls.add(rollKey);

        const uniqueCandidates = Array.from(new Map(candidates.map(p => [p.user, p])).values());
        if (uniqueCandidates.length === 0) { onComplete(); return; }

        const items      = [];
        const winnerPos  = 40;
        const totalItems = 55;

        for (let i = 0; i < totalItems; i++) {
            if (i === winnerPos) {
                items.push({ ...finalWinner, _id: `roll-${rollKey}-winner-${i}`, isWinner: true });
            } else {
                const candidate = uniqueCandidates[Math.floor(Math.random() * uniqueCandidates.length)];
                items.push({ ...candidate, _id: `roll-${rollKey}-${i}`, isWinner: false });
            }
        }

        setDisplayItems(items);
        setAnimState('ready');

        return () => { setTimeout(() => startedRolls.delete(rollKey), 10000); };
    }, [rollKey, isRolling, finalWinner, candidates, onComplete]);

    useEffect(() => {
        if (animState !== 'ready' || !stripRef.current || !containerRef.current) return;

        const strip         = stripRef.current;
        const container     = containerRef.current;
        const winnerPos     = 40;
        const containerWidth = container.offsetWidth;
        const centerOffset  = (containerWidth - ITEM_WIDTH) / 2;
        const finalX        = centerOffset - (winnerPos * TOTAL_ITEM_WIDTH);
        const startX        = centerOffset + (containerWidth / 2) + (ITEM_WIDTH * 2);

        strip.style.transition = 'none';
        strip.style.transform  = `translate3d(${startX}px, 0, 0)`;
        void strip.offsetWidth;

        const rafId = requestAnimationFrame(() => {
            if (!strip) return;
            setAnimState('rolling');
            strip.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.7, 0.1, 1)';
            strip.style.transform  = `translate3d(${finalX}px, 0, 0)`;

            const highlightTimer = setTimeout(() => setIsWinnerHighlighted(true), 3500);
            const completeTimer  = setTimeout(() => { setAnimState('complete'); onComplete(); }, 3800);

            return () => { clearTimeout(highlightTimer); clearTimeout(completeTimer); };
        });

        return () => cancelAnimationFrame(rafId);
    }, [animState, onComplete, rollKey]);

    useEffect(() => {
        if (animState !== 'rolling') return;
        const safety = setTimeout(() => {
            if (animState === 'rolling') {
                setAnimState('complete');
                setIsWinnerHighlighted(true);
                onComplete();
            }
        }, 6000);
        return () => clearTimeout(safety);
    }, [animState, onComplete]);

    if (!isRolling && displayItems.length === 0) {
        return (
            <div className="w-full h-[168px] flex items-center justify-center text-white/20 text-sm">Ready to roll</div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden select-none" style={{ height: 168 }}>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none" style={{ width: ITEM_WIDTH }}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${isWinnerHighlighted ? 'ring-4 ring-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'ring-2 ring-red-500/60 bg-red-500/5'}`} />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #ef4444', filter: 'drop-shadow(0 0 8px rgba(239,68,68,1))' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '16px solid #ef4444', filter: 'drop-shadow(0 0 8px rgba(239,68,68,1))' }} />

            <div ref={stripRef} className="absolute top-0 bottom-0 flex items-center will-change-transform" style={{ gap: GAP, left: 0 }}>
                {displayItems.map((item) => {
                    const isHighlighted = isWinnerHighlighted && item.isWinner;
                    return (
                        <div
                            key={item._id}
                            style={{ width: ITEM_WIDTH, flexShrink: 0, height: 148 }}
                            className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl transition-all duration-300 ${isHighlighted ? 'bg-red-500/40 ring-2 ring-red-400 scale-105 shadow-[0_0_32px_rgba(239,68,68,0.8)] z-10' : 'bg-white/5'}`}
                        >
                            <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
                                <div className={`w-full h-full rounded-full overflow-hidden ring-2 transition-all duration-300 ${isHighlighted ? 'ring-red-400' : 'ring-white/20'}`}>
                                    <UserAvatar src={item.avatar} alt={item.user} className="w-full h-full" />
                                </div>
                                {isHighlighted && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">👑</motion.div>
                                )}
                            </div>
                            <span className={`text-[11px] font-bold truncate w-full text-center leading-tight px-1 transition-colors ${isHighlighted ? 'text-white' : 'text-white/60'}`}>
                                {item.user}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
        </div>
    );
});
SlotMachineWheel.displayName = 'SlotMachineWheel';

// --- BOT GENERATOR ---
const BOT_NAMES = ['xXSlayerXx','ProGamer2024','NightOwl','ShadowHunter','CyberNinja','DragonFire','StealthMode','PixelWarrior','CodeBreaker','NeonRider','ThunderBolt','GhostFace','RapidFire','SilentKill','ToxicPlayer','EliteSniper','FastFingers','DarkSoul','IceCold','FireStorm'];
const COLORS    = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500','#800080'];

const generateBot = (id) => {
    const name = BOT_NAMES[id % BOT_NAMES.length] + Math.floor(Math.random() * 999);
    return {
        id: `bot-${id}-${Date.now()}`,
        user: name,
        text: '',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        badges: [{ type: 'bot', text: 'BOT' }],
        timestamp: Date.now(),
        isBot: true,
        isSubscriber: Math.random() > 0.7,
        isModerator: false,
    };
};

const KICK_CHANNEL   = 'zynkogambles';
const PUSHER_KEY     = '32cbd69e4b950bf97679';
const PUSHER_CLUSTER = 'us2';

export default function Picker() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput]     = useState('');
    const [error, setError]                     = useState('');
    const correctPassword = process.env.NEXT_PUBLIC_PICKER_PASSWORD || 'zynkoace';

    const [messages, setMessages]                 = useState([]);
    const [winner, setWinner]                     = useState(null);
    const [isPicking, setIsPicking]               = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [pickerKeyword, setPickerKeyword]       = useState('zynko');
    const [participants, setParticipants]         = useState([]);
    const [channelInfo, setChannelInfo]           = useState(null);

    const [subLuck, setSubLuck]                     = useState(false);
    const [subLuckMultiplier, setSubLuckMultiplier] = useState(2);
    const [excludeModerators, setExcludeModerators] = useState(false);
    const [excludeBots, setExcludeBots]             = useState(false);
    const [allowReEntry, setAllowReEntry]           = useState(false);
    const [autoPick, setAutoPick]                   = useState(false);
    const [autoPickDelay, setAutoPickDelay]         = useState(30);

    const [bannedCount, setBannedCount]   = useState(0);
    const [timeoutCount, setTimeoutCount] = useState(0);
    const [unbanCount, setUnbanCount]     = useState(0);
    const [isLive, setIsLive]             = useState(false);
    const [viewerCount, setViewerCount]   = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [rollCount, setRollCount]       = useState(0);
    const [isTestMode, setIsTestMode]     = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [rollKey, setRollKey]           = useState(0);

    const chatContainerRef = useRef(null);
    const wsRef            = useRef(null);
    const reconnectTimeout = useRef(null);
    const pingInterval     = useRef(null);
    const passwordInputRef = useRef(null);
    const autoPickTimerRef = useRef(null);
    const pickingLockRef   = useRef(false);

    useEffect(() => {
        if (chatContainerRef.current)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        if (!isAuthenticated && passwordInputRef.current) passwordInputRef.current.focus();
    }, [isAuthenticated]);

    useEffect(() => {
        if (autoPickTimerRef.current) { clearTimeout(autoPickTimerRef.current); autoPickTimerRef.current = null; }
        if (autoPick && participants.length > 0 && !isPicking && !winner) {
            autoPickTimerRef.current = setTimeout(() => {
                if (!isPicking && !winner) handlePickWinner();
            }, autoPickDelay * 1000);
        }
    }, [autoPick, participants.length, isPicking, winner, autoPickDelay]);

    // --- WebSocket connection ---
    useEffect(() => {
        if (!isAuthenticated || isTestMode) return;
        let isActive = true, ws = null;

        const connect = async () => {
            try {
                let channelData = { avatar: null, username: KICK_CHANNEL, viewerCount: 0, isLive: false, chatroomId: null };

                try {
                    const res = await fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`, {
                        headers: { 'Accept': 'application/json' },
                        credentials: 'omit',
                    });
                    if (res.ok) {
                        const d = await res.json();
                        let avatar =
                            d.user?.profile_pic       ||
                            d.user?.profilepic        ||
                            d.user?.profile_picture   ||
                            d.user?.avatar            ||
                            null;

                        if (avatar?.startsWith('//')) avatar = 'https:' + avatar;

                        channelData = {
                            avatar,
                            username:    d.user?.username || KICK_CHANNEL,
                            viewerCount: d.livestream?.viewer_count || 0,
                            isLive:      !!d.livestream,
                            chatroomId:  d.chatroom?.id || null,
                        };
                    }
                } catch (err) {
                    console.warn('Failed to fetch channel info:', err);
                }

                if (!channelData.chatroomId) throw new Error('Could not get chatroom ID');

                setChannelInfo(channelData);
                setViewerCount(channelData.viewerCount || 0);
                setIsLive(channelData.isLive || false);

                if (channelData.avatar) {
                    avatarCache.set(KICK_CHANNEL.toLowerCase(), channelData.avatar);
                }

                ws = new WebSocket(`wss://ws-${PUSHER_CLUSTER}.pusher.com:443/app/${PUSHER_KEY}?protocol=7&client=js&version=8.4.0&flash=false`);
                wsRef.current = ws;

                ws.onmessage = async (event) => {
                    if (!isActive) return;
                    try {
                        const msg       = JSON.parse(event.data);
                        const eventName = msg.event;
                        const eventData = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;

                        if (eventName === 'pusher:connection_established') {
                            ws.send(JSON.stringify({
                                event: 'pusher:subscribe',
                                data: { auth: '', channel: `chatrooms.${channelData.chatroomId}.v2` },
                            }));
                        }

                        if (eventName === 'pusher_internal:subscription_succeeded') {
                            setConnectionStatus('Connected');
                            pingInterval.current = setInterval(() => {
                                if (ws.readyState === WebSocket.OPEN)
                                    ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
                            }, 60000);
                        }

                        if (eventName === 'pusher:ping') {
                            ws.send(JSON.stringify({ event: 'pusher:pong', data: {} }));
                        }

                        if (
                            eventName === 'App\\Events\\ChatMessageSentEvent' ||
                            eventName === 'App\\Events\\ChatMessageEvent'
                        ) {
                            const messageData = eventData.message || eventData;
                            const userData    = eventData.sender  || eventData.user;
                            if (!userData) return;

                            const username = userData.username || userData.slug || 'Unknown';
                            const key      = username.toLowerCase();

                            // --- Build badges from identity ---
                            const badges = [];
                            (userData.identity?.badges || []).forEach(b => {
                                const t = (b.type || '').toLowerCase();
                                if (t) badges.push({ type: t, text: b.text || t, count: b.count || null });
                            });
                            if (username.toLowerCase() === KICK_CHANNEL.toLowerCase() && !badges.some(x => x.type === 'broadcaster')) {
                                badges.unshift({ type: 'broadcaster', text: 'Broadcaster', count: null });
                            }
                            if (userData.isSuperAdmin) badges.push({ type: 'admin', text: 'Staff', count: null });

                            const text = messageData.content || messageData.message || '';

                            // --- Avatar: try WS data first, then cache, then queue API fetch ---
                            let avatar =
                                userData.profile_pic       ||
                                userData.profilepic        ||
                                userData.profile_picture   ||
                                userData.avatar            ||
                                null;

                            if (avatar?.startsWith('//')) avatar = 'https:' + avatar;

                            // Store in cache if freshly found from WS
                            if (avatar && !avatarCache.has(key)) {
                                avatarCache.set(key, avatar);
                            }

                            // Use cache if WS gave nothing
                            if (!avatar) avatar = avatarCache.get(key) || null;

                            const msgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                            const newMsg = {
                                id:           msgId,
                                user:         username,
                                text,
                                color:        userData.identity?.color || '#53fc18',
                                avatar,
                                badges,
                                timestamp:    Date.now(),
                                isBot:        false,
                                isSubscriber: userData.is_subscribed || badges.some(b => b.type === 'subscriber' || b.type === 'sub'),
                                isModerator:  badges.some(b => b.type === 'moderator'),
                            };

                            setMessages(prev => [...prev.slice(-199), newMsg]);
                            setTotalEntries(prev => prev + 1);

                            // If still no avatar, fetch from Kick API in background
                            if (!avatar && !avatarCache.has(key)) {
                                fetchKickAvatar(username).then((fetchedAvatar) => {
                                    if (!fetchedAvatar || !isActive) return;
                                    // Back-fill avatar into any existing messages for this user
                                    setMessages(prev =>
                                        prev.map(m =>
                                            m.user === username && !m.avatar
                                                ? { ...m, avatar: fetchedAvatar }
                                                : m
                                        )
                                    );
                                });
                            }
                        }
                    } catch (e) {
                        console.error('WS message error:', e);
                    }
                };

                ws.onclose = () => {
                    if (!isActive) return;
                    setConnectionStatus('Disconnected');
                    clearInterval(pingInterval.current);
                    reconnectTimeout.current = setTimeout(() => { if (isActive) connect(); }, 3000);
                };

                ws.onerror = err => console.error('WS error:', err);

            } catch (err) {
                console.error('Connect error:', err);
                if (!isActive) return;
                setConnectionStatus('Failed');
                reconnectTimeout.current = setTimeout(() => { if (isActive) connect(); }, 5000);
            }
        };

        connect();
        return () => {
            isActive = false;
            clearInterval(pingInterval.current);
            clearTimeout(reconnectTimeout.current);
            ws?.close();
        };
    }, [isAuthenticated, isTestMode]);

    // --- Calculate participants ---
    useEffect(() => {
        const keyword = pickerKeyword.trim().toLowerCase();
        if (!keyword) { setParticipants([]); return; }

        const unique = new Map();
        messages.forEach(msg => {
            if (!msg.text || msg.text.trim().toLowerCase() !== keyword) return;
            if (excludeBots && msg.isBot) return;
            if (excludeModerators && msg.isModerator) return;

            const weight = subLuck && msg.isSubscriber ? subLuckMultiplier : 1;

            if (!unique.has(msg.user)) {
                unique.set(msg.user, { ...msg, weight, entries: 1 });
            } else if (allowReEntry) {
                const ex = unique.get(msg.user);
                ex.entries++;
                ex.weight += weight;
            }
        });

        const weighted = [];
        unique.forEach(p => {
            for (let i = 0; i < p.weight; i++)
                weighted.push({ ...p, _weightId: `${p.id}-${i}` });
        });

        setParticipants(weighted);
    }, [messages, pickerKeyword, subLuck, subLuckMultiplier, excludeBots, excludeModerators, allowReEntry]);

    // --- Pick winner ---
    const handlePickWinner = useCallback(() => {
        if (pickingLockRef.current || isPicking || participants.length === 0) return;
        pickingLockRef.current = true;

        const uniqueParticipants = Array.from(new Map(participants.map(p => [p.user, p])).values());
        if (uniqueParticipants.length === 0) { pickingLockRef.current = false; return; }

        const selected = participants[Math.floor(Math.random() * participants.length)];
        if (!selected?.user) { pickingLockRef.current = false; return; }

        // Grab freshest avatar from cache or messages
        const cachedAvatar  = avatarCache.get(selected.user.toLowerCase());
        const latestMsg     = messages.find(m => m.user === selected.user);
        const winnerAvatar  = cachedAvatar || latestMsg?.avatar || selected.avatar || null;

        const winnerWithAvatar = { ...selected, avatar: winnerAvatar };

        setRollKey(prev => prev + 1);
        setWinner(winnerWithAvatar);
        setIsPicking(true);
        setRollCount(prev => prev + 1);

        setTimeout(() => { pickingLockRef.current = false; }, 100);
    }, [isPicking, participants, messages]);

    const handleRollComplete = useCallback(() => setIsPicking(false), []);

    const addTestBots = useCallback(() => {
        setIsTestMode(true);
        const newBots = [];
        for (let i = 0; i < 20; i++) {
            const bot = generateBot(i);
            bot.text = pickerKeyword;
            newBots.push(bot);
        }
        newBots.forEach((bot, i) => {
            setTimeout(() => {
                setMessages(prev => [...prev.slice(-199), bot]);
                setTotalEntries(prev => prev + 1);
            }, i * 100);
        });
    }, [pickerKeyword]);

    const clearAll = useCallback(() => {
        setMessages([]);
        setParticipants([]);
        setWinner(null);
        setTotalEntries(0);
        setRollCount(0);
        setBannedCount(0);
        setTimeoutCount(0);
        setUnbanCount(0);
        setRollKey(prev => prev + 1);
        avatarCache.clear();
        pickingLockRef.current = false;
    }, []);

    const handleLogin = useCallback((e) => {
        e.preventDefault();
        if (passwordInput === correctPassword) {
            setIsAuthenticated(true); setError('');
        } else {
            setError('Incorrect Password');
            setPasswordInput('');
            passwordInputRef.current?.focus();
        }
    }, [passwordInput, correctPassword]);

    const eligibleCount = useMemo(() => new Set(participants.map(p => p.user)).size, [participants]);

    const AppNavbar = () => (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000]/90 backdrop-blur-md text-white border-b border-red-900/30">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
                <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" loading="eager" />
                <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
                    {[{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboards' }, { href: '/bonuses', label: 'Bonuses' }, { href: '/picker', label: 'Picker', active: true }].map((item) => (
                        <Link key={item.href} href={item.href} className="relative group">
                            <span className={`${item.active ? 'text-red-400' : 'text-white'} hover:text-red-400 transition-colors`}>
                                {item.label}
                                <span className={`absolute left-0 -bottom-1 h-[2px] ${item.active ? 'w-full' : 'w-0'} bg-red-500 transition-all duration-300 group-hover:w-full`}></span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );

    const AppFooter = () => (
        <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative">
            <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
                <div className="flex gap-6 mb-4">
                    <a href="https://www.youtube.com/@zynko333/featured" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"><img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 select-none pointer-events-none" loading="lazy" /></a>
                    <a href="https://kick.com/zynkogambles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"><img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert select-none pointer-events-none" loading="lazy" /></a>
                    <a href="https://discord.gg/zynko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"><img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 select-none pointer-events-none" loading="lazy" /></a>
                </div>
                <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
            </div>
        </footer>
    );

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen bg-[#0a0000] overflow-hidden relative select-none">
                <AnimatedBackground /><AppNavbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm p-8 bg-black/80 backdrop-blur-md border border-red-800/50 rounded-2xl z-10 text-white shadow-2xl">
                        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Enter Password</h2>
                        <form onSubmit={handleLogin}>
                            <input ref={passwordInputRef} type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full mt-2 mb-4 px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white text-center font-semibold tracking-wider focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all" placeholder="••••••••" autoComplete="off" autoFocus />
                            <button type="submit" className="w-full px-8 py-3 text-white font-semibold text-base rounded-xl bg-gradient-to-r from-red-600 to-red-700 border border-red-700 shadow-[0_0_8px_rgba(255,80,80,0.4)] hover:shadow-[0_0_14px_4px_rgba(255,80,80,0.3)] hover:scale-105 active:scale-95 transition duration-200 tracking-wide">Login</button>
                            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-4 text-center">{error}</motion.p>}
                        </form>
                    </motion.div>
                </div>
                <AppFooter />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] overflow-hidden relative select-none">
            <style jsx global>{`
                * { scrollbar-width: thin; scrollbar-color: rgba(239,68,68,0.5) rgba(0,0,0,0.3); }
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.5); border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(239,68,68,0.7); }
            `}</style>
            <AnimatedBackground /><AppNavbar />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 pt-24 pb-4 relative z-10 h-screen">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 mb-4 text-xs">
                    <span className="text-white/40">Raffle System Powered by</span>
                    <span className="text-red-500 font-bold flex items-center gap-1"><KickIcon /> ZynkoPicker</span>
                    <span className="text-white/40">|</span>
                    <span className="flex items-center gap-1 text-white/60"><CheckIcon /> Provably Fair Results.</span>
                    {isTestMode && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-bold border border-cyan-500/30">TEST MODE</motion.span>}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-140px)]">
                    {/* LEFT PANEL */}
                    <div className="lg:col-span-4 flex flex-col gap-3 h-full overflow-hidden">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-red-500/30 p-4 flex-shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Connection Setup</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <KickIcon />
                                    <button onClick={() => setShowSettings(!showSettings)} className="hover:text-white text-white/60 transition-colors"><SettingsIcon /></button>
                                </div>
                            </div>
                            <div className="bg-black/40 rounded-lg p-3 flex items-center gap-3">
                                <div className="relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-50 blur-sm" />
                                    <UserAvatar src={channelInfo?.avatar} alt={KICK_CHANNEL} className="w-12 h-12 rounded-full ring-2 ring-red-500 relative z-10" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white z-20">K</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{channelInfo?.username || KICK_CHANNEL}</span>
                                        {isLive && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">LIVE</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                                        <UsersIcon /><span>{viewerCount} VIEWERS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addTestBots} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs font-bold transition-colors"><TestTubeIcon /> Add 20 Test Bots</motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearAll} className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"><TrashIcon /></motion.button>
                            </div>
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-[10px] text-white/40 mb-1"><span>ACTIVE KEYWORD</span><span className="text-red-400">PRESS ENTER</span></div>
                                <input type="text" value={pickerKeyword} onChange={(e) => setPickerKeyword(e.target.value.toLowerCase())} onKeyDown={(e) => e.key === 'Enter' && handlePickWinner()} className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white text-sm font-bold focus:outline-none focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all" />
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {showSettings && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-white/10 p-4 overflow-hidden flex-shrink-0">
                                    <h3 className="text-xs font-bold text-white/60 uppercase mb-3">Raffle Settings</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Subscriber Luck', state: subLuck, setState: setSubLuck, extra: subLuck && <div className="flex items-center gap-2 mt-2"><span className="text-[10px] text-white/50">Multiplier:</span><input type="number" min="1" max="10" value={subLuckMultiplier} onChange={(e) => setSubLuckMultiplier(parseInt(e.target.value) || 1)} className="w-12 px-2 py-1 bg-black/50 rounded text-xs text-center" /></div> },
                                            { label: 'Exclude Moderators', state: excludeModerators, setState: setExcludeModerators },
                                            { label: 'Exclude Bots', state: excludeBots, setState: setExcludeBots },
                                            { label: 'Allow Re-entry', state: allowReEntry, setState: setAllowReEntry },
                                            { label: 'Auto Pick', state: autoPick, setState: setAutoPick, extra: autoPick && <div className="flex items-center gap-2 mt-2"><span className="text-[10px] text-white/50">After:</span><input type="number" min="5" max="300" value={autoPickDelay} onChange={(e) => setAutoPickDelay(parseInt(e.target.value) || 30)} className="w-14 px-2 py-1 bg-black/50 rounded text-xs text-center" /><span className="text-[10px] text-white/50">sec</span></div> },
                                        ].map((setting, idx) => (
                                            <div key={idx}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/80">{setting.label}</span>
                                                    <button onClick={() => setting.setState(!setting.state)} className={`w-10 h-5 rounded-full transition-colors relative ${setting.state ? 'bg-red-500' : 'bg-white/20'}`}>
                                                        <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white" animate={{ x: setting.state ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                                                    </button>
                                                </div>
                                                {setting.extra}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex-1 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col min-h-0 overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' || isTestMode ? 'bg-red-500' : 'bg-gray-500'}`} />
                                    <span className="text-xs font-bold text-white/60">LIVE CHAT</span>
                                </div>
                                <span className="text-[10px] text-red-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {connectionStatus === 'Connected' || isTestMode ? 'CONNECTED' : 'DISCONNECTED'}
                                </span>
                            </div>
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2 space-y-1">
                                <AnimatePresence>
                                    {messages.length === 0
                                        ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/20 text-sm py-10">Waiting for messages...</motion.div>
                                        : messages.map(msg => <ChatMessage key={msg.id} msg={msg} isEntry={msg.text?.trim().toLowerCase() === pickerKeyword} />)
                                    }
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="lg:col-span-8 flex flex-col gap-3 h-full overflow-hidden">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3 flex-shrink-0">
                            {[
                                { icon: <UsersIcon />,   label: 'Entries',  value: totalEntries, color: 'blue' },
                                { icon: <CheckIcon />,   label: 'Eligible', value: eligibleCount, color: 'red', active: true },
                                { icon: <HashIcon />,    label: 'Keyword',  value: pickerKeyword, color: 'purple', isText: true },
                                { icon: <DiamondIcon />, label: 'Sub Luck', value: subLuck ? `${subLuckMultiplier}x` : 'OFF', color: 'pink' },
                            ].map((stat, idx) => (
                                <motion.div key={idx} whileHover={{ scale: 1.02, y: -2 }} className={`bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border ${stat.active ? 'border-red-500/30' : 'border-white/10'} p-3 flex items-center gap-3`}>
                                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>{stat.icon}</div>
                                    <div>
                                        <div className={`text-[10px] uppercase font-bold ${stat.active ? 'text-red-400' : 'text-white/40'}`}>{stat.label}</div>
                                        <div className={`text-2xl font-black ${stat.isText ? 'text-lg truncate max-w-[80px]' : 'text-white'}`}>{stat.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-white/10 relative overflow-hidden flex flex-col min-h-0">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
                                <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-lg border border-orange-500/30">
                                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                                    <span className="text-xs font-bold text-orange-400">
                                        {isPicking ? 'ROLLING...' : winner ? 'WINNER SELECTED' : 'WAITING FOR ENTRIES'}
                                    </span>
                                    {autoPick && !isPicking && !winner && participants.length > 0 && <span className="text-xs text-orange-400/60">(Auto: {autoPickDelay}s)</span>}
                                </motion.div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded text-[10px] text-red-400 border border-red-500/30"><BanIcon /> {bannedCount}</div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded text-[10px] text-orange-400 border border-orange-500/30"><ClockIcon /> {timeoutCount}</div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded text-[10px] text-green-400 border border-green-500/30"><UnlockIcon /> {unbanCount}</div>
                                </div>
                            </div>

                            <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {isPicking ? (
                                        <motion.div key={`rolling-${rollKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center px-4">
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-xs text-red-400 uppercase tracking-[0.3em] font-bold mb-6">🎰 Spinning...</motion.div>
                                            <div className="w-full">
                                                <SlotMachineWheel
                                                    key={rollKey}
                                                    isRolling={isPicking}
                                                    candidates={participants}
                                                    finalWinner={winner}
                                                    onComplete={handleRollComplete}
                                                    rollKey={rollKey}
                                                />
                                            </div>
                                        </motion.div>
                                    ) : winner ? (
                                        <motion.div key={`winner-${rollKey}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
                                            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs uppercase tracking-[0.3em] text-red-400 font-bold mb-6">Winner Is</motion.div>
                                            <div className="relative inline-block">
                                                <div className="absolute -inset-4 rounded-full bg-red-500/30 blur-xl animate-pulse" />
                                                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-600 to-red-400 opacity-60 blur-md" />
                                                <div className="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-red-500 bg-black">
                                                    <UserAvatar src={winner.avatar} alt={winner.user} className="w-full h-full" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent pointer-events-none" />
                                                </div>
                                                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring" }} className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl shadow-lg ring-2 ring-white/20">👑</motion.div>
                                            </div>
                                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-4xl font-black text-white italic" style={{ textShadow: '0 0 40px rgba(239,68,68,0.6)' }}>
                                                {winner.user}
                                            </motion.div>
                                            {winner.isSubscriber && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2 text-xs text-purple-400 font-bold">⭐ Subscriber</motion.div>}
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/30">
                                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-32 h-32 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center ring-2 ring-white/10"><TrophyIcon /></motion.div>
                                            <p className="text-lg font-bold">Ready to pick winner</p>
                                            <p className="text-sm text-white/40 mt-1">{eligibleCount} eligible</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-red-500 font-bold"><CheckIcon /> FAIR</span>
                                    <span className="text-white/40 font-mono truncate max-w-[150px]">HASH: {btoa(rollCount + pickerKeyword).substring(0, 15)}...</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-white/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}
                                    </span>
                                    <span className="text-white/40 font-mono">ROLLS: {rollCount}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl border border-white/10 p-3 flex-shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase font-bold"><UsersIcon /> Eligible Participants ({eligibleCount})</div>
                                {subLuck && <div className="text-[10px] text-purple-400">Subs have {subLuckMultiplier}x luck</div>}
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {participants.length === 0
                                    ? <span className="text-xs text-white/20 py-2">No entries yet...</span>
                                    : Array.from(new Map(participants.map(p => [p.user, p])).values()).map(p => (
                                        <motion.div key={p.user} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0 flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:border-red-500/30 transition-colors">
                                            <UserAvatar src={p.avatar} alt={p.user} className="w-6 h-6 rounded-full" />
                                            <span className="text-xs font-medium text-white/80">{p.user}</span>
                                            {p.isSubscriber && <span className="text-[10px] text-purple-400">⭐</span>}
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={participants.length > 0 && !isPicking ? { scale: 1.01 } : {}}
                            whileTap={participants.length > 0 && !isPicking ? { scale: 0.99 } : {}}
                            onClick={handlePickWinner}
                            disabled={isPicking || participants.length === 0}
                            className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-lg flex-shrink-0 ${isPicking || participants.length === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white hover:shadow-red-500/40 animate-pulse'}`}
                        >
                            <TrophyIcon />
                            {isPicking
                                ? <span className="flex items-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>Rolling...</span>
                                : `Pick Winner (${eligibleCount})`
                            }
                        </motion.button>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}