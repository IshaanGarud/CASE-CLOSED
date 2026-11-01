import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  PenTool
} from 'lucide-react';
import { CASE_CC001 } from '../data/caseCC001';
import { sound } from '../utils/soundEffects';

export function CaseJournal({ 
  journalEvents, 
  sharedNotes, 
  onSaveNotes 
}) {
  const [activeTab, setActiveTab] = useState('events');
  const [noteDraft, setNoteDraft] = useState(sharedNotes || '');

  const handleNotesChange = (e) => {
    setNoteDraft(e.target.value);
    onSaveNotes(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header with Navigation Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-noir-900 border border-noir-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amberGold-500/20 text-amberGold-400">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 bg-amberGold-500/10 px-2 py-0.5 rounded border border-amberGold-500/20">
                CHRONICLE
              </span>
              <span className="text-xs text-zinc-400 font-mono">CASE CC-001 ARCHIVES</span>
            </div>
            <h2 className="text-xl font-serif font-black text-zinc-100 mt-0.5">
              The Case Journal
            </h2>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-noir-950 p-1 rounded-lg border border-noir-750 font-mono text-xs">
          {[
            { id: 'events', label: 'Room Log', icon: Clock },
            { id: 'briefing', label: 'Case Dossier', icon: FileText },
            { id: 'notes', label: 'Field Notes', icon: PenTool }
          ].map(tab => {
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

      {/* Realistic Antique Journal Area */}
      <div className="bg-[#f5eedc] text-[#1c1813] rounded-2xl p-6 sm:p-8 border-4 border-[#3e3427] shadow-2xl min-h-[460px] font-typewriter relative overflow-hidden">
        
        {/* Binder Spine Shadow */}
        <div className="absolute top-0 bottom-0 left-4 w-1.5 bg-[#423321] opacity-25 pointer-events-none" />

        {/* TAB 1: Real-time Chronological Room Events */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                  Shared Room Activity Stream
                </h3>
                <p className="text-xs text-[#524434] font-sans">
                  Chronological log of movements, evidence discoveries, and interrogations across all detectives.
                </p>
              </div>
              <span className="text-xs text-[#524434] font-mono">
                {journalEvents.length} Recorded Entries
              </span>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-[#b8a783] ml-2 mt-4">
              {journalEvents.map((evt) => (
                <div key={evt.id} className="relative pl-4 group">
                  <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#3b2d1d] border-2 border-[#f5eedc]" />
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-crimson-900">
                    <span>{evt.time}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#ded2b5] text-[#3e3122]">
                      {evt.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#261f18] leading-relaxed mt-0.5">
                    {evt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Case Dossier & Victim Information */}
        {activeTab === 'briefing' && (
          <div className="space-y-5">
            <div className="border-b border-[#cfc09f] pb-3">
              <h3 className="font-serif font-black text-xl text-[#1a140d] uppercase">
                {CASE_CC001.title}
              </h3>
              <p className="text-xs italic text-[#524434]">
                {CASE_CC001.subtitle} • {CASE_CC001.date}
              </p>
            </div>

            <div className="bg-[#ede2cb] p-4 rounded-lg border border-[#cfc09f] space-y-2 text-xs leading-relaxed">
              <strong className="text-crimson-900 font-serif text-sm block">
                Victim Profile: {CASE_CC001.victim.name} (Age {CASE_CC001.victim.age})
              </strong>
              <p><strong>Profession:</strong> {CASE_CC001.victim.occupation}</p>
              <p><strong>Cause of Demise:</strong> {CASE_CC001.victim.causeOfDeath}</p>
              <p><strong>Estimated Time:</strong> {CASE_CC001.victim.timeOfDeathEstimate}</p>
              <p className="italic text-[#4a3d2e] pt-1 border-t border-[#dfd3b7]">
                "{CASE_CC001.victim.bio}"
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3e3223]">
                Official Initial Briefing
              </h4>
              <p className="text-xs leading-relaxed text-[#2a2218] bg-[#fcf9f2] p-4 rounded border border-[#dfd4be]">
                {CASE_CC001.synopsis}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Shared Field Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="border-b border-[#cfc09f] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-lg text-[#1a140d] uppercase">
                  Shared Detective Scratchpad
                </h3>
                <p className="text-xs text-[#524434] font-sans">
                  Shared notes visible to your team. Type deductions, suspect alibi contradictions, and theories.
                </p>
              </div>
              <span className="text-xs text-[#524434] font-mono">Auto-saved to Room</span>
            </div>

            <textarea
              value={noteDraft}
              onChange={handleNotesChange}
              placeholder="Record your findings, e.g., 'Arthur claims he cut his hand on soda glass, but the conservatory French doors have blood on them...'"
              rows={12}
              className="w-full p-4 rounded-lg bg-[#fcf9f2] border-2 border-[#d3c3a1] text-[#221c15] text-xs sm:text-sm font-typewriter focus:outline-none focus:border-amberGold-600 shadow-inner resize-none leading-relaxed"
            />
          </div>
        )}

      </div>

    </div>
  );
}
