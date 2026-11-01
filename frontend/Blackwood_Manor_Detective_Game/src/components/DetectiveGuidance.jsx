import React, { useState } from 'react';
import { 
  HelpCircle, 
  Compass, 
  Search, 
  MessageSquare, 
  Gavel, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Sparkles,
  Users
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export function DetectiveGuidance({ 
  currentRoom, 
  currentPlayerId, 
  locations, 
  suspects, 
  evidence, 
  tasks,
  activeTab, 
  setActiveTab 
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentRoom) return null;

  const discoveredEvidenceIds = currentRoom.discoveredEvidenceIds || [];
  const completedTaskIds = currentRoom.completedTaskIds || [];
  const alibiBrokenSuspectIds = currentRoom.alibiBrokenSuspectIds || [];
  const status = currentRoom.status;
  const isHost = currentRoom.players?.find(p => p.id === currentPlayerId)?.isHost;
  const playerCount = currentRoom.players?.length || 0;

  // Determine dynamic guidance step based on current room and case state
  let currentStep = {
    title: "Explore the Estate",
    action: "Inspect hotspots in the Study, Lounge, and Cellar to uncover physical clues.",
    targetTab: "map",
    buttonText: "Go to Investigation Map",
    icon: Compass,
    badge: "PHASE 1: FORENSICS"
  };

  if (status === 'WAITING') {
    if (playerCount < 2) {
      currentStep = {
        title: "Assemble Your Detective Bureau",
        action: "Share your room code with a partner or click '+ Add Demo Partner' to proceed with investigation protocols.",
        targetTab: "lobby",
        buttonText: "Open Room Lobby",
        icon: Users,
        badge: "STEP 1: RECRUITMENT"
      };
    } else {
      currentStep = {
        title: "Launch Investigation",
        action: isHost 
          ? "Your team is assembled. Click 'Enter Investigation Workspace' below to start the clock."
          : "Your team is assembled. The host can now launch the investigation workspace.",
        targetTab: "lobby",
        buttonText: "View Lobby",
        icon: Sparkles,
        badge: "STEP 2: COMMENCE"
      };
    }
  } else if (discoveredEvidenceIds.length < 3) {
    currentStep = {
      title: "Search Crime Scenes for Evidence",
      action: "Examine Julian's Private Study and the Cellar. Inspect desk, fireplace hearth, and crystal tumblers to gather physical exhibits.",
      targetTab: "map",
      buttonText: "Enter Investigation Map",
      icon: Search,
      badge: "PHASE 1: EVIDENCE GATHERING"
    };
  } else if (alibiBrokenSuspectIds.length < 1) {
    currentStep = {
      title: "Interrogate Suspects & Break Alibis",
      action: "Review suspect dossiers. Confront suspects with contradictory evidence (e.g., confront Dr. Reginald Thorne with the Empty Poison Vial).",
      targetTab: "suspects",
      buttonText: "Open Suspect Dossiers",
      icon: MessageSquare,
      badge: "PHASE 2: INTERROGATION"
    };
  } else if (discoveredEvidenceIds.length < evidence.length) {
    currentStep = {
      title: "Uncover Remaining Case Exhibits",
      action: `You have secured ${discoveredEvidenceIds.length}/${evidence.length} exhibits. Check unsearched hotspots in the estate blueprint.`,
      targetTab: "map",
      buttonText: "Inspect Estate Blueprint",
      icon: Search,
      badge: "PHASE 3: FORENSIC COMPLETION"
    };
  } else if (status !== 'COMPLETED') {
    currentStep = {
      title: "Formulate Final Cooperative Verdict",
      action: "All evidence is secured and suspect contradictions are exposed. Convene with your detectives and submit your final accusation.",
      targetTab: "accusation",
      buttonText: "Deliver Cooperative Verdict",
      icon: Gavel,
      badge: "PHASE 4: VERDICT"
    };
  } else {
    currentStep = {
      title: "Case Closed",
      action: "The final verdict has been logged with Scotland Yard. You may review the case journal or click 'Reopen & Play Again' to reset.",
      targetTab: "accusation",
      buttonText: "Review Verdict",
      icon: CheckCircle2,
      badge: "CASE CONCLUDED"
    };
  }

  const Icon = currentStep.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4">
      <div className="rounded-xl bg-gradient-to-r from-noir-950 via-noir-900 to-noir-950 border border-amberGold-500/40 shadow-xl overflow-hidden">
        
        {/* Toggle Bar */}
        <div 
          onClick={() => {
            sound.playTypewriter();
            setIsExpanded(!isExpanded);
          }}
          className="px-4 py-2.5 bg-noir-900/90 border-b border-noir-800 flex items-center justify-between cursor-pointer hover:bg-noir-850 transition"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amberGold-500/20 text-amberGold-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amberGold-300">
              Detective Field Guide • What Should I Do Next?
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-950 border border-noir-750 text-zinc-400">
              {currentStep.badge}
            </span>
          </div>

          <button className="text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1">
            <span>{isExpanded ? 'Minimize' : 'Expand Guidance'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Guidance Content */}
        {isExpanded && (
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-amberGold-950/60 border border-amberGold-700/50 text-amberGold-400 shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <span>{currentStep.title}</span>
                </h4>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed max-w-3xl">
                  {currentStep.action}
                </p>
              </div>
            </div>

            {activeTab !== currentStep.targetTab && (
              <button
                onClick={() => {
                  sound.playPageTurn();
                  setActiveTab(currentStep.targetTab);
                }}
                className="self-start sm:self-center px-4 py-2 rounded-lg bg-amberGold-600 hover:bg-amberGold-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow-noir-glow flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>{currentStep.buttonText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
