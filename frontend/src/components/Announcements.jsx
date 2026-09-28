import { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Announcements({ role }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ title, content, is_urgent: isUrgent })
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setIsUrgent(false);
        setShowForm(false);
        fetchAnnouncements();
      }
    } catch (err) {
      console.error("Failed to post announcement", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-white flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-primary-400" />
            Live Event Timeline
          </h2>
          <p className="text-zinc-400 mt-2">Latest updates and announcements from the organizers.</p>
        </div>
        
        {(role === 'admin' || role === 'organizer') && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Broadcast'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6">
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Announcement Title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 transition-colors font-medium text-lg"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Write the update here..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 h-24 resize-none transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                    />
                    Mark as Urgent (Red Alert)
                  </label>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Megaphone className="w-4 h-4" />
                    Broadcast Update
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative pl-6 border-l-2 border-white/[0.05] space-y-8 py-4">
        {loading ? (
          <div className="text-zinc-500">Loading timeline...</div>
        ) : announcements.length === 0 ? (
          <div className="text-zinc-500">No announcements yet. Enjoy the quiet!</div>
        ) : (
          announcements.map((ann, idx) => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className={`absolute -left-[35px] top-1 w-4 h-4 rounded-full border-4 border-bg-darker ${ann.is_urgent ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary-500'}`} />
              <div className={`p-6 rounded-2xl border ${ann.is_urgent ? 'bg-red-500/[0.02] border-red-500/20' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-heading font-semibold flex items-center gap-2 ${ann.is_urgent ? 'text-red-400' : 'text-white'}`}>
                    {ann.is_urgent && <AlertTriangle className="w-5 h-5" />}
                    {ann.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium bg-white/[0.03] px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-xs text-zinc-500">
                  <span className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center font-semibold text-zinc-400">
                    {ann.author_name.charAt(0)}
                  </span>
                  Posted by {ann.author_name}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
