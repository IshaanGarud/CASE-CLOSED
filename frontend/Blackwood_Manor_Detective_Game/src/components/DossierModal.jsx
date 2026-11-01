import React from 'react';
import { X, FileText, Skull, Clock, MapPin, Users } from 'lucide-react';
import { CASE_CC001 } from '../data/caseCC001';
import { sound } from '../utils/soundEffects';

export function DossierModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#f7f2e4] text-[#1f1a14] rounded-lg shadow-2xl border-4 border-[#3e3427] overflow-hidden max-h-[90vh] flex flex-col font-typewriter">
        
        {/* Top Confidential Stamp Header */}
        <div className="bg-[#2d241a] text-[#e8dbbe] px-6 py-3 flex items-center justify-between border-b-2 border-[#1c150e]">
          <div className="flex items-center gap-2">
            <span className="bg-crimson-700 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-crimson-500">
              CONFIDENTIAL • HOMICIDE
            </span>
            <span className="text-xs tracking-wider text-[#d5be94]">RECORD #{CASE_CC001.caseId}</span>
          </div>
          <button 
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            className="text-[#d5be94] hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="border-b border-[#c8bc9e] pb-4 text-center">
            <h2 className="text-2xl font-serif font-black tracking-wide uppercase text-[#1a1510]">
              {CASE_CC001.title}
            </h2>
            <p className="text-sm italic text-[#594d3c] mt-0.5">{CASE_CC001.subtitle}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#4a3e2e]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-crimson-800" /> {CASE_CC001.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-crimson-800" /> {CASE_CC001.location}
              </span>
            </div>
          </div>

          {/* Victim Profile Box */}
          <div className="bg-[#ece3ce] p-4 rounded border border-[#cfc09f] shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-crimson-800 flex items-center gap-1">
                <Skull className="w-4 h-4" /> Deceased Identification
              </span>
              <span className="text-xs bg-[#ded2b5] px-2 py-0.5 rounded text-[#3d3224] font-bold">
                Age: {CASE_CC001.victim.age}
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#140f0a]">
              {CASE_CC001.victim.name}
            </h3>
            <p className="text-xs text-[#524434] leading-relaxed">
              <strong>Profession:</strong> {CASE_CC001.victim.occupation}
            </p>
            <p className="text-xs text-[#524434] leading-relaxed">
              <strong>Coroner Preliminary Report:</strong> {CASE_CC001.victim.causeOfDeath}
            </p>
            <p className="text-xs text-[#524434] leading-relaxed">
              <strong>Time of Demise Estimate:</strong> {CASE_CC001.victim.timeOfDeathEstimate}
            </p>
            <p className="text-xs text-[#524434] italic border-t border-[#ded3b8] pt-2 mt-2">
              "{CASE_CC001.victim.bio}"
            </p>
          </div>

          {/* Narrative Overview */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#413324] mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amberGold-600" /> Case Synopsis
            </h4>
            <div className="text-xs leading-relaxed text-[#2a2218] whitespace-pre-line bg-[#fbf8ee] p-4 rounded border border-[#dfd4be] shadow-sm">
              {CASE_CC001.synopsis}
            </div>
          </div>

          {/* Cooperative Rules Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded bg-amber-100/60 border border-amber-300 text-xs text-amber-900">
            <Users className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
            <p>
              <strong>Shared Investigation Protocol:</strong> Evidence discoveries and task progress are shared across all detectives in your room. Work together to examine sectors, interrogate suspects, and deliver one cooperative verdict.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#2d241a] px-6 py-3 border-t-2 border-[#1c150e] flex justify-end">
          <button
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-amberGold-600 hover:bg-amberGold-500 text-black text-xs font-bold uppercase tracking-wider transition shadow"
          >
            Acknowledge & Close Case File
          </button>
        </div>

      </div>
    </div>
  );
}
