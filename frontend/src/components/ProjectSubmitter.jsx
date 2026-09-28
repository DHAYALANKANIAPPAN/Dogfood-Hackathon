import { useState, useEffect } from 'react';
import { Code2, Send } from 'lucide-react';

export default function ProjectSubmitter({ token }) {
  const [tracks, setTracks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repo_url: '',
    demo_url: '',
    track_id: '',
    is_draft: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/data/tracks')
      .then(res => res.json())
      .then(data => {
        setTracks(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, track_id: data[0].id }));
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.track_id) {
      alert("No tracks available.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(res.ok) {
        alert("Project submitted successfully!");
        setFormData({ title: '', description: '', repo_url: '', demo_url: '', track_id: tracks[0]?.id || '', is_draft: false });
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch(err) {
      alert("Failed to submit project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-darker p-6 rounded-2xl border border-white/5 space-y-6">
      <h3 className="font-medium text-lg mb-4 flex items-center gap-2 text-white">
        <Code2 className="w-5 h-5 text-primary-400"/> Project Submission
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Project Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g., Localize" />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
          <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="Short description of your hack" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">GitHub Repo</label>
            <input type="url" value={formData.repo_url} onChange={e => setFormData({...formData, repo_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Demo Video / URL</label>
            <input type="url" value={formData.demo_url} onChange={e => setFormData({...formData, demo_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="https://youtube.com/..." />
          </div>
        </div>

        <div className="pt-2">
          <button disabled={isSubmitting} type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-xl py-2.5 text-sm font-bold shadow-lg shadow-primary-500/20 transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Final Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
