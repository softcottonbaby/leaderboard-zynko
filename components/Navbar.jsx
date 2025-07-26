import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full bg-black">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 border-b border-red-600">
          <Link href="/">
            <Image
              src="/logo/logonavbar.webp"
              alt="Zynko logo"
              width={32}
              height={32}
              draggable={false}
              className="select-none"
            />
          </Link>
          <nav className="flex items-center space-x-6 text-sm text-white font-semibold">
            <Link href="/" className="hover:text-red-400 transition">Home</Link>
            <Link href="/leaderboard" className="hover:text-red-400 transition">Leaderboards</Link>
            <Link href="/bonuses" className="hover:text-red-400 transition">Bonuses</Link>
          </nav>
        </div>
        <div className="h-[2px] bg-red-500" />
      </div>
    </header>
  );
}
