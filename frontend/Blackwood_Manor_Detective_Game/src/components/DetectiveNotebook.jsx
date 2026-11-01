import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  PenTool, 
  Lightbulb
} from 'lucide-react';
import { TIMELINE_EVENTS } from '../data/caseData';
import { sound } from '../utils/soundEffects';

export function DetectiveNotebook({ 
  suspects, 
  userNotes, 
  onSaveNotes 
}) {
  const [activeTab, setActiveTab] = useState('suspects');
  const [noteInput, setNoteInput] = useState(userNotes || '');

  const handleNotesChange = (e) => {
    setNoteInput(e.target.value);
    onSaveNotes(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Notebook Cover Ribbon Header */}
      <div className="p-4 rounded-xl bg-noir-900 border border-noir-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-amberGold-500/20 text-amberGold-400">
            📓
          </span>
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-100">
              Detective's Field Journal
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Personal field notes, reconstructed timeline & deduction matrix
            </p>
          </div>
        </div>

        {/* Notebook Internal Tabs */}
        <div className="flex items-center bg-noir-950 p-1 rounded-md border border-noir-750 font-mono text-xs">
          {[
            { id: 'suspects', label: 'Suspects', icon: Users },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'notes', label: 'My Notes', icon: PenTool },
            { id: 'hints', label: 'Deductions', icon: Lightbulb }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPageTurn();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amberGold-600 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Paper Journal Area */}
      <div className="bg-[#f5eedc] text-[#1c1813] rounded-2xl p-6 sm:p-8 border-4 border-[#3e3427] shadow-2xl min-h-[480px] font-typewriter relative overflow-hidden">
        
        {/* Binder Spine Decoration */}
        <div className="absolute top-0 bottom-0 left-4 w-1.5 bg-[#423321] opacity-30 pointer-events-none" />

        {/* Tab 1: Suspect Alibi Matrix */}
        {activeTab === 'suspects' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                Suspect Alibi Ledger
              </h3>
              <span className="text-xs text-[#524434] font-mono">
                {suspects.filter(s => s.alibiBroken).length} / {suspects.length} Alibis Shattered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suspects.map((s) => (
                <div 
                  key={s.id}
                  className="p-4 rounded bg-[#ede3ce] border border-[#d3c3a1] shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-sm text-[#140f0a] flex items-center gap-2">
                      <span className="text-xl">{s.avatar}</span>
                      <span>{s.name}</span>
                    </span>
                    {s.alibiBroken ? (
                      <span className="px-2 py-0.5 rounded bg-crimson-800 text-white font-mono text-[10px] font-bold">
                        ALIBI SHATTERED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#dac9a5] text-[#4d3d2a] font-mono text-[10px]">
                        Unbroken Alibi
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#524434] italic">
                    "{s.claimedAlibi}"
                  </p>

                  <div className="pt-2 border-t border-[#dfd2b5] text-xs space-y-1">
                    <div>
                      <strong className="text-[#382b1d]">Motive:</strong> {s.motive}
                    </div>
                    {s.alibiBroken && (
                      <div className="text-crimson-900 font-bold">
                        Contradiction Clue: {s.contradictionClueId} (Exposed)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Reconstructed Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                Timeline of October 31, 1927
              </h3>
              <span className="text-xs text-[#524434] font-mono">Reconstructed Sequence</span>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-[#b8a783] ml-2">
              {TIMELINE_EVENTS.map((evt, idx) => (
                <div key={idx} className="relative pl-4 group">
                  <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#3b2d1d] border-2 border-[#f5eedc]" />
                  <div className="text-xs font-mono font-bold text-crimson-900">
                    {evt.time}
                  </div>
                  <h4 className="font-serif font-black text-sm text-[#140f0a]">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-[#4a3b2b] leading-relaxed mt-0.5">
                    {evt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Freeform Detective Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                Detective's Personal Field Scratchpad
              </h3>
              <span className="text-xs text-[#524434] font-mono">Auto-saved</span>
            </div>

            <p className="text-xs text-[#524434]">
              Type your thoughts, suspect theories, or remind yourself of unanswered clues:
            </p>

            <textarea
              value={noteInput}
              onChange={handleNotesChange}
              placeholder="Record your deductions here... e.g., 'Arthur claims he was at the carriage house, but why was there mud in the conservatory? Why did the clock stop at 11:42 PM if the cyanide acts in 90 seconds?'"
              rows={12}
              className="w-full p-4 rounded-lg bg-[#fcf9f2] border-2 border-[#d3c3a1] text-[#221c15] text-xs sm:text-sm font-typewriter focus:outline-none focus:border-amberGold-600 shadow-inner resize-none leading-relaxed"
            />
          </div>
        )}

        {/* Tab 4: Detective Hints & Deductions */}
        {activeTab === 'hints' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                Investigative Deduction Clues
              </h3>
              <span className="text-xs text-[#524434] font-mono">Deduction Logic</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded bg-[#ece2cd] border border-[#d3c3a1] text-xs leading-relaxed">
                <strong className="text-crimson-900 block mb-1">
                  1. The Clock Mystery:
                </strong>
                The grandfather clock stopped at 11:42 PM, but the gears show micro-scratches from someone turning the hands backwards. Why would someone want the death to appear to have happened at 11:42 PM?
              </div>

              <div className="p-3.5 rounded bg-[#ece2cd] border border-[#d3c3a1] text-xs leading-relaxed">
                <strong className="text-crimson-900 block mb-1">
                  2. Chemical Forensics:
                </strong>
                Potassium Cyanide is a specialized toxic compound. Who among the guests has institutional access to pharmacy or hospital stocks? Look for an apothecary vial!
              </div>

              <div className="p-3.5 rounded bg-[#ece2cd] border border-[#d3c3a1] text-xs leading-relaxed">
                <strong className="text-crimson-900 block mb-1">
                  3. Multiple Intruders:
                </strong>
                Just because Arthur broke the window and stole the will doesn't make him the poisoner. Remember: a burglar can stumble upon an already poisoned victim!
              </div>

              <div className="p-3.5 rounded bg-[#ece2cd] border border-[#d3c3a1] text-xs leading-relaxed">
                <strong className="text-crimson-900 block mb-1">
                  4. The Blackmail Ring:
                </strong>
                Check the burned ledger scraps in the library fireplace. The code 'TR-8' is the key to unlocking the true financial motive.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
