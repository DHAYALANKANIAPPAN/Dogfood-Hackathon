import { useState } from 'react';
import { Calendar, Trophy, Plus, Save, Trash2, Settings2 } from 'lucide-react';

export default function AdminConfig() {
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Main Track', prize: '₹80000' }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const addTrack = () => {
    setTracks([...tracks, { id: Date.now(), name: '', prize: '' }]);
  };

  const removeTrack = (id) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 backdrop-blur-md mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-3 text-red-100">
          <Settings2 className="w-6 h-6 text-red-400" /> Event Configuration
        </h2>
        <button onClick={handleSave} className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/20 transition-all flex items-center gap-2">
          {isSaved ? <span className="text-slate-900">Saved!</span> : <><Save className="w-4 h-4" /> Save Configuration</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Event Details & Dates */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2">Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hackathon Name</label>
                <input type="text" defaultValue="Dogfood 2026" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Organizer</label>
                <input type="text" defaultValue="raptors.dev" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-400" /> Configurable Dates
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Registration Opens</label>
                  <input type="datetime-local" defaultValue="2026-08-24T00:00" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Formation</label>
                  <input type="datetime-local" defaultValue="2026-09-21T00:00" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hackathon Starts</label>
                  <input type="datetime-local" defaultValue="2026-09-25T18:00" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hackathon Ends (Deadline)</label>
                  <input type="datetime-local" defaultValue="2026-09-28T18:00" className="block w-full px-4 py-3 bg-bg-darker border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Tracks & Prizes */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-400" /> Tracks & Prizes
            </h3>
            <button onClick={addTrack} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Track
            </button>
          </div>

          <div className="space-y-4">
            {tracks.map((track, index) => (
              <div key={track.id} className="p-5 bg-bg-darker border border-slate-200 rounded-2xl relative group">
                <button 
                  onClick={() => removeTrack(track.id)}
                  className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Track Name</label>
                    <input 
                      type="text" 
                      defaultValue={track.name} 
                      placeholder="e.g. Best Judging Engine"
                      className="block w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">Prize Amount</label>
                    <input 
                      type="text" 
                      defaultValue={track.prize} 
                      placeholder="e.g. ₹10000"
                      className="block w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {tracks.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
                No tracks configured. Add a track to set up the prize pool.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
