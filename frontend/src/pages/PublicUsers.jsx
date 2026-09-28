import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function PublicUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/data/public/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading users...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-bold mb-8 text-white">Participants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{u.name}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Participant</p>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-zinc-500">No participants registered yet.</p>}
      </div>
    </div>
  );
}
