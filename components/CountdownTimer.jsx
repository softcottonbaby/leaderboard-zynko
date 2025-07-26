'use client';
import { useState, useEffect } from 'react';

const END_TIME = new Date('2025-07-28T18:00:00');

function getTimeRemaining() {
  const total = END_TIME - new Date();
  const seconds = Math.max(0, Math.floor((total / 1000) % 60));
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));
  return { days, hours, minutes, seconds, total };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.total <= 0) {
    return (
      <div className="relative z-20 bg-white/20 max-w-md mx-auto text-center py-4 px-6 rounded-xl border border-pink-300/30 mb-10 animate-fade-in-up">
        <p className="font-semibold text-white text-sm">LEADERBOARD CONCLUDED</p>
        <p className="text-xs text-white mt-1">Check our Discord for your next chance to win!</p>
      </div>
    );
  }

  return (
    <div className="relative z-20 bg-white/10 backdrop-blur-md max-w-md mx-auto text-center py-4 px-6 rounded-xl border border-white/30 mb-10 animate-fade-in-up shadow-md">
      <p className="font-semibold text-white text-sm">LEADERBOARD ENDS IN</p>
      <div className="mt-2 text-lg font-bold tracking-wide text-white">
        {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
}
