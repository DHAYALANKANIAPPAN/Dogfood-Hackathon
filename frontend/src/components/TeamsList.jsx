import { useState, useEffect } from 'react';
import { Users, Trash2, Edit2, Check, X } from 'lucide-react';

export default function TeamsList({ role, token }) {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/data/teams', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTeams(data || []))
    .catch(err => console.error(err));
  }, [token]);

  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
        setTeams(teams.filter(t => t.id !== teamId));
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail}`);
      }
    } catch(e) {
      alert("Failed to delete team.");
    }
  };

  const handleEditSave = async (teamId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: editName })
      });
      if(res.ok) {
        setTeams(teams.map(t => t.id === teamId ? { ...t, name: editName } : t));
        setEditingTeam(null);
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail}`);
      }
    } catch(e) {
      alert("Failed to update team.");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md mt-8">
      <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white">
        <Users className="w-6 h-6 text-primary-400" /> Teams & Participants
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-bg-darker p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {editingTeam === team.id ? (
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="bg-bg-darker border border-white/20 rounded px-2 py-1 text-white text-lg font-bold outline-none focus:border-primary-500 w-full mb-2"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-white leading-tight">{team.name}</h3>
                    )}
                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-zinc-300 mt-1 inline-block shrink-0">Code: {team.invite_code}</span>
                  </div>
                  {role === 'admin' && (
                    <div className="flex gap-1 shrink-0 ml-2">
                      {editingTeam === team.id ? (
                        <>
                          <button onClick={() => handleEditSave(team.id)} className="p-2 text-green-400 hover:bg-white/5 rounded-lg transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingTeam(null)} className="p-2 text-zinc-400 hover:bg-white/5 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingTeam(team.id); setEditName(team.name); }} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(team.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                {team.members.map(m => (
                    <li key={m.id} className="text-sm text-zinc-300 flex items-center gap-3 bg-white/5 p-2 rounded-xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} className="w-8 h-8 rounded-full bg-black/50" />
                    <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-zinc-500">{m.email}</p>
                    </div>
                    </li>
                ))}
                {team.members.length === 0 && <li className="text-sm text-zinc-500 italic px-2">No members yet</li>}
                </ul>
            </div>
          </div>
        ))}
        {teams.length === 0 && <p className="text-zinc-500 italic">No teams formed yet.</p>}
      </div>
    </div>
  );
}
