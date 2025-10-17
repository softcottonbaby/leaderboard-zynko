import React, { useState, useEffect } from 'react';

export default function BonusHuntPage() {
  const [bonuses, setBonuses] = useState([]); // active bonuses
  const [history, setHistory] = useState([]);  // past bonuses
  const [adminMode, setAdminMode] = useState(false);

  const [bonusName, setBonusName] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusDesc, setBonusDesc] = useState('');
  const [bonusLink, setBonusLink] = useState('');

  useEffect(() => {
    const savedBonuses = JSON.parse(localStorage.getItem('bonuses') || '[]');
    const savedHistory = JSON.parse(localStorage.getItem('bonusHistory') || '[]');
    setBonuses(savedBonuses);
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('bonuses', JSON.stringify(bonuses));
    localStorage.setItem('bonusHistory', JSON.stringify(history));
  }, [bonuses, history]);

  function addBonus(e) {
    e.preventDefault();
    if (!bonusName || !bonusAmount) return;

    const newBonus = {
      id: Date.now(),
      name: bonusName,
      amount: bonusAmount,
      desc: bonusDesc,
      link: bonusLink,
      dateAdded: new Date().toLocaleString(),
    };

    setBonuses(prev => [...prev, newBonus]);
    setBonusName('');
    setBonusAmount('');
    setBonusDesc('');
    setBonusLink('');
  }

  function completeBonus(id) {
    const bonus = bonuses.find(b => b.id === id);
    if (!bonus) return;
    setBonuses(prev => prev.filter(b => b.id !== id));
    setHistory(prev => [bonus, ...prev]);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <h1 className="text-4xl mb-6 text-red-600 font-bold">🎁 Bonus Hunt</h1>

      <button 
        onClick={() => setAdminMode(prev => !prev)} 
        className="mb-6 px-4 py-2 bg-red-700 hover:bg-red-600 rounded"
      >
        {adminMode ? 'Exit Admin Mode' : 'Enter Admin Mode'}
      </button>

      {adminMode && (
        <form onSubmit={addBonus} className="mb-8 p-4 bg-neutral-900 rounded-lg shadow-lg border border-red-700">
          <h2 className="text-2xl mb-4 text-red-500 font-semibold">Add New Bonus</h2>
          <input className="block mb-3 p-3 w-full bg-neutral-800 rounded border border-red-600" placeholder="Bonus Name" value={bonusName} onChange={e => setBonusName(e.target.value)} />
          <input className="block mb-3 p-3 w-full bg-neutral-800 rounded border border-red-600" placeholder="Amount" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} />
          <input className="block mb-3 p-3 w-full bg-neutral-800 rounded border border-red-600" placeholder="Description" value={bonusDesc} onChange={e => setBonusDesc(e.target.value)} />
          <input className="block mb-3 p-3 w-full bg-neutral-800 rounded border border-red-600" placeholder="Link" value={bonusLink} onChange={e => setBonusLink(e.target.value)} />
          <button type="submit" className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-bold">Add Bonus</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl mb-4 text-red-500 font-semibold">Active Bonuses ({bonuses.length})</h3>
          <div className="space-y-4">
            {bonuses.map(b => (
              <div key={b.id} className="p-4 bg-neutral-900 rounded-lg border border-red-600 shadow hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-red-600">{b.name}</h4>
                    <p className="text-red-400 font-semibold">{b.amount}</p>
                  </div>
                  {adminMode && (
                    <button onClick={() => completeBonus(b.id)} className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded">Complete</button>
                  )}
                </div>
                {b.desc && <p className="mt-2 text-red-300">{b.desc}</p>}
                {b.link && <a href={b.link} target="_blank" className="text-blue-400 mt-1 inline-block">Go to Bonus</a>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl mb-4 text-red-500 font-semibold">History</h3>
          <div className="space-y-4">
            {history.map(b => (
              <div key={b.id} className="p-4 bg-neutral-900 rounded-lg border border-red-700 shadow">
                <h4 className="text-xl font-bold text-red-600">{b.name}</h4>
                <p className="text-red-400 font-semibold">{b.amount}</p>
                <p className="text-red-300 text-sm mt-1">Added: {b.dateAdded}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
