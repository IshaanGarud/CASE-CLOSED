import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gavel, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function CooperativeVerdict({ 
  currentRoom, 
  evidence, 
  discoveredEvidenceIds, 
  suspects, 
  alibiBrokenSuspectIds, 
  onSubmitVerdict,
  onResetInvestigation 
}) {
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedMotive, setSelectedMotive] = useState('');
  const [selectedSmokingGun, setSelectedSmokingGun] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verdictResult = currentRoom.verdictResult;
  const isRoomCompleted = currentRoom.status === 'COMPLETED' && verdictResult;

  const canSubmit = selectedCulprit && selectedWeapon && selectedMotive && selectedSmokingGun && !isSubmitting && !isRoomCompleted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    sound.playDramaticSting();
    setIsSubmitting(true);

    try {
      const result = await onSubmitVerdict({
        culpritId: selectedCulprit,
        murderMethodId: selectedWeapon,
        motiveId: selectedMotive,
        smokingGunId: selectedSmokingGun
      });

      if (result?.isWin) {
        sound.playVictory();
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-crimson-950/80 via-noir-900 to-noir-950 border-2 border-crimson-700/60 shadow-blood-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-crimson-900/60 text-crimson-300 border border-crimson-600/50">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">
              Cooperative Final Accusation
            </h2>
            <p className="text-xs text-zinc-300 font-sans">
              All detectives in Room {currentRoom.roomCode} collaborate to name the murderer, method, motive, and smoking gun.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amberGold-400 bg-noir-950 px-3 py-1.5 rounded border border-noir-750">
          ONE SUBMISSION PER ROOM
        </span>
      </div>

      {/* If Verdict is Already Decided */}
      {isRoomCompleted ? (
        <div className={`p-8 rounded-2xl border-2 shadow-2xl space-y-6 ${
          verdictResult.isWin
            ? 'bg-gradient-to-b from-amber-950/40 via-noir-900 to-noir-950 border-amberGold-500/70 shadow-noir-glow'
            : 'bg-noir-900 border-crimson-700/60'
        }`}>
          <div className="flex items-center justify-between border-b border-noir-750 pb-4">
            <div className="flex items-center gap-3">
              <span className={`p-3.5 rounded-full text-2xl font-black ${
                verdictResult.isWin ? 'bg-amberGold-500 text-black shadow-noir-glow' : 'bg-crimson-700 text-white'
              }`}>
                {verdictResult.grade}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amberGold-400 block">
                  OFFICIAL TRIBUNAL VERDICT
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {verdictResult.title}
                </h3>
              </div>
            </div>

            {verdictResult.isWin && (
              <span className="px-3 py-1 rounded bg-amberGold-500/20 border border-amberGold-500/40 text-amberGold-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amberGold-400" /> CASE CLOSED
              </span>
            )}
          </div>

          <div className="p-6 rounded-xl bg-noir-950/90 border border-noir-800 text-xs sm:text-sm text-zinc-200 font-typewriter leading-relaxed whitespace-pre-line shadow-inner">
            {verdictResult.epilogue}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-noir-800">
            <span className="text-xs font-mono text-zinc-400">
              Submitted at {verdictResult.submittedAt}
            </span>

            <button
              onClick={onResetInvestigation}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reopen & Play Again</span>
            </button>
          </div>
        </div>
      ) : (
        /* Accusation Form */
        <div className="p-6 sm:p-8 rounded-2xl bg-noir-900 border border-noir-750 shadow-2xl space-y-6">
          
          {/* Quick Recap of Room Evidence & Alibis */}
          <div className="p-4 rounded-xl bg-noir-950 border border-noir-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Room Evidence:</span>
              <span className="text-emerald-400 font-bold">
                {discoveredEvidenceIds.length} / {evidence.length} Exhibits Secured
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Alibis Shattered:</span>
              <span className="text-crimson-400 font-bold">
                {alibiBrokenSuspectIds.length} / {suspects.length} Suspects Broken
              </span>
            </div>
          </div>

          {/* Pillar 1: Culprit */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 block">
              1. Name the Murderer:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suspects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedCulprit(s.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedCulprit === s.id
                      ? 'bg-crimson-950/80 border-crimson-500 text-white font-bold shadow-blood-glow'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{s.avatar}</span>
                    <span>{s.name}</span>
                  </span>
                  {selectedCulprit === s.id && <CheckCircle2 className="w-4 h-4 text-crimson-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 2: Murder Weapon / Method */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 block">
              2. Identify the Murder Method:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "poison_scotch", label: "Potassium Cyanide in Glenfarclas Scotch" },
                { id: "dagger", label: "Ornamental Damascus Dagger" },
                { id: "strangulation", label: "Silk Scarf Asphyxiation" },
                { id: "blunt_force", label: "Blunt Trauma with Brass Mantel Clock" }
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedWeapon(w.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedWeapon === w.id
                      ? 'bg-amberGold-950/80 border-amberGold-500 text-amberGold-200 font-bold shadow-noir-glow'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span>{w.label}</span>
                  {selectedWeapon === w.id && <CheckCircle2 className="w-4 h-4 text-amberGold-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 3: Motive */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 block">
              3. Identify the True Motive:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "narcotics_blackmail", label: "Blackmail over stolen hospital narcotics & antique money laundering (Code TR-8)" },
                { id: "syndicate_flight", label: "Escaping mob extortion and syndicate hitmen" },
                { id: "inheritance_debt", label: "Preventing total disinheritance to cover $50,000 mob gambling debts" },
                { id: "robbery", label: "Simple burglary of wall safe jewels and bearer bonds" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedMotive(m.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedMotive === m.id
                      ? 'bg-amberGold-950/80 border-amberGold-500 text-amberGold-200 font-bold shadow-noir-glow'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span>{m.label}</span>
                  {selectedMotive === m.id && <CheckCircle2 className="w-4 h-4 text-amberGold-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 4: Smoking Gun Evidence */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 block">
              4. Present the Smoking Gun Physical Evidence:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evidence.map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedSmokingGun(e.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedSmokingGun === e.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{e.imagePlaceholder}</span>
                    <span>{e.name}</span>
                  </span>
                  {selectedSmokingGun === e.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-noir-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 font-sans">
              Submitting registers the definitive verdict for all detectives in this room.
            </p>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-2xl ${
                canSubmit
                  ? 'bg-crimson-600 hover:bg-crimson-500 text-white shadow-blood-glow cursor-pointer'
                  : 'bg-noir-800 text-zinc-600 border border-noir-750 cursor-not-allowed'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating with Bureau...' : 'Submit Room Verdict'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
