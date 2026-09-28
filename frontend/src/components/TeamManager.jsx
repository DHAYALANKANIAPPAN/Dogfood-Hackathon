import { useState } from 'react';
import { Users, Plus, LogIn } from 'lucide-react';

export default function TeamManager({ token }) {
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: teamName })
      });
      const data = await res.json();
      if(res.ok) {
        alert(`Team created! Invite code: ${data.invite_code}`);
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch(e) {
      alert("Error creating team.");
    }
  };

  const handleJoin = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ invite_code: inviteCode })
      });
      const data = await res.json();
      if(res.ok) alert(`Successfully joined team!`);
      else alert(`Error: ${data.detail}`);
    } catch(e) {
      alert("Error joining team.");
    }
  };

  return (
    <div className="bg-bg-darker p-6 rounded-2xl border border-slate-200 space-y-6">
      <div>
        <h3 className="font-medium text-lg mb-4 flex items-center gap-2 text-slate-900"><Plus className="w-5 h-5 text-primary-600"/> Create a Team</h3>
        <input type="text" placeholder="Team Name" value={teamName} onChange={e=>setTeamName(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 mb-3 text-slate-900 focus:outline-none focus:border-primary-500 transition-colors"/>
        <button onClick={handleCreate} className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-xl py-2.5 text-sm font-bold shadow-lg shadow-primary-500/20 transition-colors">Create Team</button>
      </div>
      <div className="border-t border-slate-200 pt-6">
        <h3 className="font-medium text-lg mb-4 flex items-center gap-2 text-slate-900"><LogIn className="w-5 h-5 text-blue-400"/> Join a Team</h3>
        <input type="text" placeholder="Invite Code (e.g. ALPHA_2026)" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 mb-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"/>
        <button onClick={handleJoin} className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 rounded-xl py-2.5 text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors">Join Team</button>
      </div>
    </div>
  );
}
