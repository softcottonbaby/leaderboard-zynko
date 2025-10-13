import React from "react";

export default function PodiumTop3({
  players = [],
  accent = "#00BFFF",
  rewardLabel = "USDT",
  iconPath = "/chips/chipsicon.svg",
  wagerIcon = "/chips/chipsicon.svg",
  totalPrize = "2000",
  loading = false, // 👈 optional prop to trigger smooth transition
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

  return (
    <div
      className={`flex flex-col items-center mb-10 transition-opacity duration-500 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Podium (Top 3) */}
      <div className="flex justify-center items-end gap-6 flex-wrap mb-10">
        <PodiumCard
          player={topThree[1]}
          position={2}
          accent={accent}
          rewardLabel={rewardLabel}
          iconPath={iconPath}
          wagerIcon={wagerIcon}
          className="translate-y-6"
        />
        <PodiumCard
          player={topThree[0]}
          position={1}
          accent={accent}
          rewardLabel={rewardLabel}
          iconPath={iconPath}
          wagerIcon={wagerIcon}
          isPrimary
        />
        <PodiumCard
          player={topThree[2]}
          position={3}
          accent={accent}
          rewardLabel={rewardLabel}
          iconPath={iconPath}
          wagerIcon={wagerIcon}
          className="translate-y-6"
        />
      </div>
    </div>
  );
}

/* ----------------------------------------
   PODIUM CARD COMPONENT
---------------------------------------- */
function PodiumCard({
  player,
  position,
  accent,
  rewardLabel,
  iconPath,
  wagerIcon,
  isPrimary = false,
  className = "",
}) {
  const isEmpty = player.username === "EMPTY";

  const rankBadgeColor =
    position === 1
      ? "bg-yellow-400 text-black"
      : position === 2
      ? "bg-gray-300 text-black"
      : "bg-orange-500 text-black";

  const cardSize = isPrimary ? "w-56 h-[340px]" : "w-52 h-[300px]";
  const avatarSize = isPrimary ? "w-24 h-24" : "w-20 h-20";

  const wagered = player.wageredAmount
    ? `$${Number(player.wageredAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`
    : "–";

  const reward =
    player.reward && player.reward !== "0.00 USDT"
      ? typeof player.reward === "string"
        ? player.reward
        : `${Number(player.reward).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ${rewardLabel}`
      : "–";

  return (
    <div
      className={`relative rounded-2xl bg-[rgba(0,0,0,0.55)] border border-[${accent}] shadow-[0_0_20px_rgba(0,0,0,0.25)] ${cardSize} flex flex-col items-center justify-start p-4 ${className} transition-transform hover:-translate-y-2`}
      style={{ backdropFilter: "blur(6px)" }}
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <div
          className="rounded-full p-[1.5px]"
          style={{ border: `1.5px solid ${accent}` }}
        >
          {isEmpty ? (
            // 🟢 Show solid black circle for empty slot
            <div
              className={`${avatarSize} rounded-full bg-black border border-white/10`}
            />
          ) : (
            // 🟢 Show avatar image for real player
            <img
              src={player.avatar || player.profilePicture || "/default-avatar.png"}
              alt={player.username}
              className={`${avatarSize} rounded-full object-cover border border-white/10`}
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          )}
        </div>
        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 ${rankBadgeColor} rounded-full flex items-center justify-center text-xs font-bold border border-black`}
        >
          {position}
        </div>
      </div>

      {/* Username */}
      <p className="font-bold text-white text-base mb-2 tracking-wide">
        {isEmpty ? "EMPTY" : player.username}
      </p>

      {/* Wagered */}
      <p
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: accent }}
      >
        WAGERED
      </p>
      <p className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
        <img src={wagerIcon} alt="coin" className="w-5 h-5" />
        {wagered}
      </p>

      {/* Divider */}
      <div className="w-2/3 h-[1px] bg-white/10 my-2" />

      {/* Reward */}
      <div className="flex flex-col items-center mt-2">
        <p
          className="text-xs uppercase tracking-wider font-semibold mb-1"
          style={{ color: accent }}
        >
          PRIZE
        </p>
        <div
          className="flex items-center justify-center gap-2 px-3 py-[4px] rounded-md border border-white/20 bg-white/10"
          style={{ color: accent }}
        >
          <img src={iconPath} alt="coin" className="w-4 h-4" />
          <span className="text-sm font-semibold">{reward}</span>
        </div>
      </div>
    </div>
  );
}
