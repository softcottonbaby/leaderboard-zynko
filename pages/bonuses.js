import { useState } from 'react';
import Link from 'next/link';

export default function Bonuses() {
    // 🔴 Flags to show/hide each bonus
    const showBonuses = {
        clash: false, // set to true to show Clash.gg bonus
        rain: true,   // set to true to show Rain.gg bonus
    };

    const bonusSites = [
        {
            id: 'clash',
            name: 'Clash.gg',
            logo: '/clashlogo/clashgg.webp',
            url: 'http://clash.gg/r/Zynko',
            features: ['3 Free Cases', 'Rakeback', '5% Deposit Bonus'],
        },
        {
            id: 'rain',
            name: 'Rain.gg',
            logo: '/rainlogo/raingg.webp',
            url: 'https://rain.gg/r/Zynko',
            features: ['Free Coins', 'Deposit Bonus', 'Weekly Leaderboard'],
        },
    ];

    const [copiedState, setCopiedState] = useState({});

    const copyCode = (id) => {
        navigator.clipboard.writeText('Zynko');
        setCopiedState({ ...copiedState, [id]: true });
        setTimeout(() => {
            setCopiedState((prev) => ({ ...prev, [id]: false }));
        }, 2000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-grid overflow-x-hidden relative select-none">
            <div className="absolute bottom-0 left-0 w-full h-[400px] bg-red-600 blur-[120px] opacity-20 pointer-events-none z-0" />

            <main className="flex-grow w-screen max-w-screen flex flex-col items-center text-center px-4 pt-32 relative z-10 pb-24">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0a0000] text-white">
                    <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-10 py-5">
                        <img src="/logonavbar/zincoZ.webp" alt="Z Logo" className="h-8 md:h-10 select-none pointer-events-none" />
                        <div className="space-x-8 text-sm font-bold tracking-wide flex items-center">
                            {[{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboards' }, { href: '/bonuses', label: 'Bonuses' }].map((item) => (
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

                {/* Heading */}
                <section className="w-full max-w-5xl px-4 text-white mt-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-1 text-white drop-shadow-[0_0_16px_rgba(255,0,0,0.8)]">
                        BONUSES
                    </h2>
                    <p className="uppercase text-xs tracking-wide text-white/70 mb-10">
                        Use my codes for instant bonuses!
                    </p>

                    <div className="flex flex-wrap justify-center gap-8">
                        {bonusSites
                            .filter((site) => showBonuses[site.id]) // ✅ filter based on flag
                            .map((site) => (
                                <div
                                    key={site.id}
                                    className="group bg-[#111] rounded-xl p-6 w-80 transform transition duration-300 hover:scale-105 shadow hover:shadow-red-500/30 border border-white/10"
                                >
                                    <div className="h-16 flex items-center justify-center mb-4">
                                        <img
                                            src={site.logo}
                                            alt={site.name}
                                            className={`transition-transform duration-300 ease-in-out group-hover:scale-110 select-none pointer-events-none ${site.id === 'rain' ? 'h-12 md:h-[52px]' : 'h-10 md:h-12'}`}
                                        />
                                    </div>

                                    <p className="text-xs uppercase text-white/50 mb-4">Casino</p>

                                    <ul className="text-sm mb-4 space-y-2">
                                        {site.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className="text-purple-400">✔</span> {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-xs text-white/60 mb-1">CODE</p>

                                    <div className="flex flex-col items-center gap-1 mb-4">
                                        {copiedState[site.id] && <p className="text-red-500 text-xs -mb-1">Copied!</p>}
                                        <div className="flex items-center justify-between bg-zinc-800 px-3 py-2 rounded-md w-full">
                                            <span className="font-bold">Zynko</span>
                                            <button
                                                onClick={() => copyCode(site.id)}
                                                className="text-sm text-white/60 hover:text-white"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>

                                    <a
                                        href={site.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-red-600 text-white text-sm font-bold py-2 rounded-lg text-center transition shadow-[0_0_12px_rgba(255,50,50,0.5)] hover:shadow-[0_0_20px_4px_rgba(255,50,50,0.6)] hover:scale-[1.03]"
                                    >
                                        CLAIM BONUS
                                    </a>
                                </div>
                            ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-[#140000] border-t border-red-800 pt-8 pb-6 z-10 relative">
                <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center px-4">
                    <div className="flex gap-6 mb-4">
                        <a
                            href="https://www.youtube.com/@zynko333/featured"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                        >
                            <img src="/icons/youtube.webp" alt="YouTube" className="w-5 h-5 select-none pointer-events-none" />
                        </a>
                        <a
                            href="https://kick.com/zynkogambles"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                        >
                            <img src="/icons/kick.png" alt="Kick" className="w-5 h-5 filter brightness-0 invert select-none pointer-events-none" />
                        </a>
                        <a
                            href="https://discord.gg/zynko"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-red-600 shadow-[0_0_12px_rgba(255,80,80,0.4)] hover:shadow-[0_0_18px_rgba(255,80,80,0.6)] hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                        >
                            <img src="/icons/discord.webp" alt="Discord" className="w-5 h-5 select-none pointer-events-none" />
                        </a>
                    </div>
                    <p className="text-white/70 text-xs">&copy; 2025 All rights reserved</p>
                    <p className="text-white/50 text-xs mt-1">
                        Made by{' '}
                        <a href="https://x.com/MMesinco" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">
                            acesnap
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
