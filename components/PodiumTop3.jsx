import React from "react";
import { motion } from "framer-motion";

export default function PodiumTop3({
  players = [],
  accent = "rgba(76, 201, 255, 0.9)",
  coinIcon, // 1. Accept the coinIcon prop
}) {
  const emptyPlayer = {
    username: "EMPTY",
    avatar: "/default-avatar.png",
    wageredAmount: null,
    reward: null,
  };

  const topThree = [
    players[0] || emptyPlayer,
    players[1] || emptyPlayer,
    players[2] || emptyPlayer,
  ];

  const podiumVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="flex justify-center items-end gap-4 md:gap-6 flex-wrap">
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={podiumVariants}
      >
        {/* 2. Pass the prop down */}
        <PodiumCard player={topThree[1]} position={2} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={podiumVariants}
      >
        {/* 2. Pass the prop down */}
        <PodiumCard player={topThree[0]} position={1} accent={accent} coinIcon={coinIcon} />
      </motion.div>
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={podiumVariants}
      >
        {/* 2. Pass the prop down */}
        <PodiumCard player={topThree[2]} position={3} accent={accent} coinIcon={coinIcon} />
      </motion.div>
    </div>
  );
}

function PodiumCard({ player, position, accent, coinIcon }) { // 1. Accept the coinIcon prop
  const isPrimary = position === 1;
  const isEmpty = player.username === "EMPTY";

  const accentColor = accent.replace(", 0.9)", ")");
  const accentGlow = accent.replace("0.9", "0.4");

  const cardSize = isPrimary ? "w-64" : "w-60 -mb-8";
  const avatarSize = isPrimary ? "w-28 h-28" : "w-24 h-24";
  const rankSize = isPrimary ? "w-10 h-10 text-lg" : "w-8 h-8 text-base";

  // Check for the gold color string
  const isGold = accent.includes("255,205,60");

  const cardStyle = {
    backgroundColor: "rgba(18, 26, 43, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1.5px solid rgba(255, 255, 255, 0.8)",
    boxShadow: isPrimary
      ? `0 0 40px ${accentGlow}`
      : `0 0 15px ${accentGlow}`,
  };

  if (isGold) {
    cardStyle.backgroundColor = "rgba(40, 30, 10, 0.4)";
  }

  const getRankStyling = (pos) => {
    switch (pos) {
      case 1: // Gold
        return {
          background: 'linear-gradient(45deg, #fce570, #efb418)',
          color: 'black',
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
        };
      case 2: // Silver
        return {
          background: 'linear-gradient(45deg, #e8ecf2, #b6c0d2)',
          color: 'black',
          boxShadow: '0 0 15px rgba(192, 192, 192, 0.6)',
        };
      case 3: // Bronze
        return {
          background: 'linear-gradient(45deg, #d99f6c, #a16b47)',
          color: 'white',
          textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
          boxShadow: '0 0 15px rgba(205, 127, 50, 0.6)',
        };
      default:
        return {};
    }
  };

  const rankBadgeStyle = getRankStyling(position);

  return (
    <div
      className={`relative rounded-2xl ${cardSize} flex flex-col items-center justify-start p-5 transition-all duration-300 hover:-translate-y-2 ${isEmpty ? "opacity-60" : ""}`}
      style={cardStyle}
    >
      <div className={`relative mb-8 ${isPrimary ? "-mt-16" : "-mt-12"}`}>
        <div
          className={`rounded-full p-[3px]`}
          style={{
            // This is the OUTER border
            border: `3px solid ${isGold ? "rgba(255, 205, 60, 0.7)" : "rgba(76, 201, 255, 0.7)"}`
          }}
        >
          <img
            src={player.avatar || player.profilePicture || "/default-avatar.png"}
            alt={isEmpty ? "Empty Slot" : `${player.username}'s avatar`}
            // --- THIS IS THE FIX ---
            // Removed static Tailwind border classes
            className={`${avatarSize} rounded-full object-cover`}
            // Added dynamic inline style for the INNER border
            style={{
              border: `2px solid ${isGold ? "rgba(255, 205, 60, 0.5)" : "rgba(76, 201, 255, 0.5)"}`
            }}
            // --- END OF FIX ---
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        </div>
        <div
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${rankSize} rounded-full flex items-center justify-center font-bold border-2 border-white/80`}
          style={rankBadgeStyle}
        >
          {position}
        </div>
      </div>

      <p className="font-bold text-white text-xl mb-4 tracking-wide truncate w-full px-2">
        {player.username}
      </p>

      <div className="w-full flex flex-col gap-3">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
            Wagered
          </p>
          <p className="text-xl font-bold text-white">
            {player.wageredAmount
              ? `$${Number(player.wageredAmount).toLocaleString()}`
              : "–"}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">
            Prize
          </p>
          {/* 3. Add the flex container and image tag */}
          <p className="text-lg font-bold flex items-center justify-center gap-2" style={{ color: accentColor }}>
            {player.reward && player.reward !== "0.00 USDT" ? (
              <>
                <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                <span>{player.reward}</span>
              </>
            ) : (
              "–"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}