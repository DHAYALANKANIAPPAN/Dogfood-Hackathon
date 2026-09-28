import { useState, useEffect } from 'react';
import { Plus, Trash2, Terminal } from 'lucide-react';

export default function AdminProblems({ token }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchProblems = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/data/public/problems');
      const data = await res.json();
      setProblems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/data/problems?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchProblems();
      } else {
        alert('Failed to create problem statement.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this problem statement?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/data/problems/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProblems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
        <h2 className="text-2xl font-heading font-semibold text-white mb-6">Add Problem Statement</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="e.g., Dogfooding our Next-Gen API"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description (Markdown / Text)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="block w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="Describe the challenge..."
              required
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Challenge
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold text-white mb-4">Existing Statements</h2>
        {problems.length === 0 && <p className="text-zinc-500">No problem statements created yet.</p>}
        {problems.map(p => (
          <div key={p.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary-400" />
                {p.title}
              </h3>
              <p className="text-zinc-400 mt-2 text-sm line-clamp-2">{p.description}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-4 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
