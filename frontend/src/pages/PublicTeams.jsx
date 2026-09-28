import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function PublicTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/data/public/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading teams...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-bold mb-8 text-slate-900">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(t => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-heading font-semibold text-slate-900">{t.name}</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Members</p>
              {t.members.length > 0 ? (
                t.members.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    {m.name}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No members yet</p>
              )}
            </div>
          </div>
        ))}
        {teams.length === 0 && <p className="text-slate-500">No teams formed yet.</p>}
      </div>
    </div>
  );
}
