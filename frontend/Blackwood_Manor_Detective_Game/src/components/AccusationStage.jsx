import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gavel, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import { DEDUCTION_OPTIONS } from '../data/caseData';
import { sound } from '../utils/soundEffects';

export function AccusationStage({ 
  onResetCase 
}) {
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedMotive, setSelectedMotive] = useState('');
  const [selectedSmokingGun, setSelectedSmokingGun] = useState('');
  
  const [verdictOutcome, setVerdictOutcome] = useState(null);

  const canSubmit = selectedCulprit && selectedWeapon && selectedMotive && selectedSmokingGun;

  const handleDeliverVerdict = () => {
    sound.playDramaticSting();

    const isCulpritRight = selectedCulprit === 'thorne';
    const isWeaponRight = selectedWeapon === 'poison_scotch';
    const isMotiveRight = selectedMotive === 'narcotics_blackmail';
    const isSmokingGunRight = selectedSmokingGun === 'clue_vial';

    const score = [isCulpritRight, isWeaponRight, isMotiveRight, isSmokingGunRight].filter(Boolean).length;

    if (score === 4) {
      sound.playVictory();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setVerdictOutcome({
        grade: 'S',
        title: 'Master Detective of the Bureau',
        verdictText: `Drawing the rain-splattered curtains in the parlor, you point directly at Dr. Reginald Thorne.

"The grandfather clock was tampered with, doctor. The escapement gears were turned back to 11:42 PM to fabricate an alibi while you sat with Lady Abernathy. But Julian was already dead by 11:30 PM—poisoned by the Potassium Cyanide you brought in the vintage Glenfarclas bottle."

You slam the heat-resistant amber vial from St. Jude's Hospital onto the mahogany table. "Embossed with your hospital toxicology depot stamp, code TR-8. Julian was blackmailing you with your illicit narcotics ring."

Dr. Thorne's clinical composure shatters. His hand twitches toward his coat pocket before the constable tackles him to the floor. The case is solved!`,
        isWin: true
      });
    } else if (isCulpritRight) {
      setVerdictOutcome({
        grade: 'B',
        title: 'Partial Justice - The Doctor Exposed',
        verdictText: `You correctly identified Dr. Reginald Thorne as the killer! However, your reconstruction of the weapon, motive, or physical proof had loopholes that Thorne's high-priced Manhattan defense attorneys might exploit.

The police take him into custody for questioning, but a stronger case with the apothecary vial and the tampered clock would guarantee a death-row conviction.`,
        isWin: false
      });
    } else if (selectedCulprit === 'arthur') {
      setVerdictOutcome({
        grade: 'D',
        title: 'Miscarriage of Justice - The Burglary Scapegoat',
        verdictText: `You accuse Arthur Vance of murder!

Arthur screams in protest: "I stole the will, yes! I broke through the conservatory glass! But Julian was already slumped over his desk when I got there! His skin was cold! I'm a thief, not a chemist!"

Two weeks later, the true killer slips across the Canadian border undetected. An innocent (though dishonest) man is sentenced to Sing Sing for a crime he didn't commit.`,
        isWin: false
      });
    } else if (selectedCulprit === 'vivienne') {
      setVerdictOutcome({
        grade: 'D',
        title: 'False Accusation - The Chanteuse Framed',
        verdictText: `You accuse Vivienne Fontaine based on her earring under the desk.

Vivienne bursts into tears: "I slapped him and ran! He was alive and swearing at me when I left the room!" Further chemical analysis proves she had zero access to hospital-grade potassium cyanide. The real killer walks free.`,
        isWin: false
      });
    } else {
      setVerdictOutcome({
        grade: 'F',
        title: 'Case Dismissed - The Killer Escapes',
        verdictText: `Your theory fails to hold up under the district attorney's scrutiny. Without aligning the true killer, weapon, motive, and physical smoking gun, the grand jury refuses to indict. The shadow of Blackwood Manor claims another unsolved chapter.`,
        isWin: false
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-crimson-950/80 via-noir-900 to-noir-950 border-2 border-crimson-700/60 shadow-blood-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-crimson-900/60 text-crimson-300 border border-crimson-600/50">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">
              The Grand Accusation
            </h2>
            <p className="text-xs text-zinc-300 font-sans">
              Summon the suspects to the drawing room, piece together the four pillars of the crime, and reveal the truth.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amberGold-400 bg-noir-950 px-3 py-1.5 rounded border border-noir-750">
          FINAL STAGE
        </span>
      </div>

      {/* Accusation Form or Verdict Outcome */}
      {!verdictOutcome ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-noir-900/95 border border-noir-750 shadow-2xl space-y-6">
          
          {/* Pillar 1: The Culprit */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 flex items-center gap-2">
              <span>1. Name the Murderer:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEDUCTION_OPTIONS.culprits.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedCulprit(c.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedCulprit === c.id
                      ? 'bg-crimson-950/80 border-crimson-500 text-white font-bold shadow-blood-glow'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span>{c.label}</span>
                  {selectedCulprit === c.id && <CheckCircle2 className="w-4 h-4 text-crimson-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar 2: The Murder Weapon / Method */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 flex items-center gap-2">
              <span>2. Identify the Murder Method:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEDUCTION_OPTIONS.weapons.map((w) => (
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

          {/* Pillar 3: The True Motive */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 flex items-center gap-2">
              <span>3. Reveal the Decisive Motive:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEDUCTION_OPTIONS.motives.map((m) => (
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

          {/* Pillar 4: The Smoking Gun Evidence */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-amberGold-400 flex items-center gap-2">
              <span>4. Present the Smoking Gun Physical Clue:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEDUCTION_OPTIONS.smokingGuns.map((sg) => (
                <button
                  key={sg.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedSmokingGun(sg.id);
                  }}
                  className={`p-3.5 rounded-lg border text-left text-xs font-serif transition flex items-center justify-between ${
                    selectedSmokingGun === sg.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-noir-950 border-noir-750 text-zinc-300 hover:border-noir-600'
                  }`}
                >
                  <span>{sg.label}</span>
                  {selectedSmokingGun === sg.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Accusation Button */}
          <div className="pt-4 border-t border-noir-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 font-sans">
              Ensure you have investigated the rooms and confronted the suspects before making this charge.
            </p>

            <button
              onClick={handleDeliverVerdict}
              disabled={!canSubmit}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-2xl ${
                canSubmit
                  ? 'bg-crimson-600 hover:bg-crimson-500 text-white shadow-blood-glow cursor-pointer'
                  : 'bg-noir-800 text-zinc-600 border border-noir-750 cursor-not-allowed'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>Deliver Final Verdict</span>
            </button>
          </div>

        </div>
      ) : (
        /* The Verdict Outcome / Cinematic Epilogue */
        <div className={`p-8 rounded-2xl border-2 shadow-2xl space-y-6 ${
          verdictOutcome.isWin
            ? 'bg-gradient-to-b from-amber-950/40 via-noir-900 to-noir-950 border-amberGold-500/70 shadow-noir-glow'
            : 'bg-noir-900 border-crimson-700/60'
        }`}>
          
          <div className="flex items-center justify-between border-b border-noir-750 pb-4">
            <div className="flex items-center gap-3">
              <span className={`p-3 rounded-full text-2xl font-black ${
                verdictOutcome.isWin ? 'bg-amberGold-500 text-black' : 'bg-crimson-700 text-white'
              }`}>
                {verdictOutcome.grade}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amberGold-400 block">
                  CASE VERDICT REPORT
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {verdictOutcome.title}
                </h3>
              </div>
            </div>

            {verdictOutcome.isWin && (
              <span className="px-3 py-1 rounded bg-amberGold-500/20 border border-amberGold-500/40 text-amberGold-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amberGold-400" /> CASE CLOSED
              </span>
            )}
          </div>

          <div className="p-6 rounded-xl bg-noir-950/90 border border-noir-800 text-xs sm:text-sm text-zinc-200 font-typewriter leading-relaxed whitespace-pre-line shadow-inner">
            {verdictOutcome.verdictText}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-noir-800">
            {!verdictOutcome.isWin ? (
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setVerdictOutcome(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-amberGold-600 hover:bg-amberGold-500 text-black text-xs font-mono font-bold uppercase tracking-wider transition shadow"
              >
                Re-Examine Evidence & Try Again
              </button>
            ) : (
              <button
                onClick={onResetCase}
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Case Again</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
