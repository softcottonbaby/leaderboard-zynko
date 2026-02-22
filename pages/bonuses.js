import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized icons
const CheckIcon = memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
));
CheckIcon.displayName = 'CheckIcon';

const CopySvgIcon = memo(({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
));
CopySvgIcon.displayName = 'CopySvgIcon';

// Memoized card component
const BonusCard = memo(({ site, copiedState, onCopy }) => {
    const isCopied = copiedState[site.id];

    return (
        <div
            className={`group rounded-2xl w-96 transform transition duration-300 hover:scale-[1.03] ${
                site.id === 'chips' 
                ? 'p-[1.5px] bg-gradient-to-r from-blue-400/40 to-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20' 
                : ''
            }`}
        >
            <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-6 h-full w-full">
                <div className="relative z-10">
                    <div className="h-16 flex items-center justify-center mb-6">
                        <img
                            src={site.logo}
                            alt={site.name}
                            className={`transition-transform duration-300 ease-in-out group-hover:scale-110 select-none pointer-events-none h-10 md:h-12`}
                            loading="lazy"
                        />
                    </div>

                    <p className="text-xs uppercase text-white/50 mb-5 tracking-widest">Available Bonuses</p>

                    <ul className="text-sm text-left mb-6 space-y-3">
                        {site.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1"><CheckIcon /></div>
                                <span className="text-white/90">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-xs text-white/60 mb-2 tracking-widest uppercase">CODE</p>

                    <div className={`w-full rounded-lg mb-8 ${site.codeContainerStyle}`}>
                        <div className="bg-slate-900 rounded-md w-full h-[52px] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {isCopied ? (
                                    <motion.div
                                        key="copied"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                                        className="font-bold text-base tracking-wider text-blue-400"
                                    >
                                        Copied!
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy-code"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        className="flex items-center justify-between w-full px-4"
                                    >
                                        <span className="font-bold text-base tracking-wider text-white">{site.code}</span>
                                        <button
                                            onClick={() => onCopy(site.id, site.code)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-white font-semibold text-sm transition active:scale-95 ${site.codeBtnColor} ${site.codeBtnHoverColor}`}
                                        >
                                            <CopySvgIcon className="w-4 h-4" /> COPY
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full bg-gradient-to-r ${site.accentColor} text-white text-base font-bold py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${site.shadowColor}`}
                    >
                        CLAIM BONUS
                    </a>
                </div>
            </div>
        </div>
    );
});
BonusCard.displayName = 'BonusCard';

export default function Bonuses() {
    // Flags to show/hide each bonus
    const showBonuses = {
        clash: false,
        chips: false,
    };

    const bonusSites = [
        {
            id: 'clash',
            name: 'Clash.gg',
            logo: '/clashlogo/clashgg.webp',
            url: 'http://clash.gg/r/Zynko',
            code: 'Zynko',
            features: ['3 Free Cases', 'Rakeback', '5% Deposit Bonus'],
            accentColor: 'from-purple-500 to-indigo-500',
            shadowColor: 'shadow-purple-500/50',
            codeContainerStyle: 'bg-[#0a0000] border border-red-700',
            codeBtnColor: 'bg-red-600',
            codeBtnHoverColor: 'hover:bg-red-700',
        },
        {
            id: 'chips',
            name: 'Chips.gg',
            logo: '/chips/chips-white.svg',
            url: 'https://chips.gg/signup?r=zynkogambles',
            code: 'zynkogambles',
            features: [
                '5% Deposit Bonus',
                '200% Welcome Bonus up to 2,000$',
                'Highroller VIP Deals (10% Deposit Bonus, 10% lossback)',
            ],
            accentColor: 'from-blue-400 to-cyan-400',
            shadowColor: 'shadow-cyan-400/50',
            codeContainerStyle: 'p-[2px] bg-gradient-to-r from-blue-700 to-cyan-700',
            codeBtnColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            codeBtnHoverColor: 'hover:from-blue-600 hover:to-cyan-600',
        },
    ];

    const [copiedState, setCopiedState] = useState({});

    const copyCode = useCallback((id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedState(prev => ({ ...prev, [id]: true }));

        // Reset after 2 seconds
        setTimeout(() => {
            setCopiedState(prev => ({ ...prev, [id]: false }));
        }, 2000);
    }, []);

    const visibleSites = bonusSites.filter(site => showBonuses[site.id]);

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
            {/* Optimized background glow */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none z-0" />

            <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
                <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000]/90 backdrop-blur-md text-white border-b border-red-900/30">
                    <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
                        <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" loading="eager" />
                        <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
                            {[{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboard' }, { href: '/bonuses', label: 'Bonuses' }].map((item) => (
                                <Link key={item.href} href={item.href} className="relative group">
                                    <span className="text-white hover:text-red-400 transition-colors">
                                        {item.label}
                                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                <section className="w-full max-w-5xl px-4 text-white mt-6">
                    <h2 className="text-5xl md:text-6xl font-extrabold mb-1 text-white">
                        BONUSES
                    </h2>

                    <p className="uppercase text-xs tracking-wide text-white/70 mb-12">
                        Use my codes for instant bonuses!
                    </p>

                    {visibleSites.length === 0 ? (
                        <div className="text-white/50 text-lg py-20">
                            No active bonuses at the moment. Check back later!
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-8">
                            {visibleSites.map((site) => (
                                <BonusCard 
                                    key={site.id}
                                    site={site}
                                    copiedState={copiedState}
                                    onCopy={copyCode}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative">
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
        </div>
    );
}