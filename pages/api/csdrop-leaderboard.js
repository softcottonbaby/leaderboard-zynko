const fetchCsdrop = useCallback(async () => {
  try {
    // Calling your local proxy
    const response = await fetch('/api/csdrop-leaderboard'); 
    if (!response.ok) throw new Error("API Failed");

    const data = await response.json();
    
    // 1. The documentation says the array is 'ranking'
    const rawList = data.rankings || []; 

    const formatted = rawList.map((p) => {
      // 2. Ensure rank is a number for the prize lookup
      const currentRank = parseInt(p.rank); 
      
      // 3. Lookup the prize from your manualCsdropPrizes { 1: 400, 2: 250... }
      const prize = manualCsdropPrizes[currentRank];

      return {
        id: p.user.hash_id,             // Fixed: uses user.hash_id from docs
        rank: currentRank,              // Fixed: uses p.rank from docs
        username: p.user.name,          // Fixed: uses user.name from docs
        avatar: p.user.avatar || "/default-avatar.png", // Fixed: uses user.avatar
        wageredAmount: parseFloat(p.total) / 100, // Fixed: converts minor units
        reward: prize ? `${prize}` : "-", // SUCCESS: This will now find the prize
      };
    });

    setPlayers(formatted);
  } catch (err) {
    console.log("Fetch failed:", err);
    setPlayers([]); 
  } finally {
    setLoading(false);
  }
}, []);