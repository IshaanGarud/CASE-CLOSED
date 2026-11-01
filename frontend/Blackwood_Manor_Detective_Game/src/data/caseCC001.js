// CASE CLOSED — Official Case Definition CC-001
// "The Blackwood Manor Mystery: Midnight at the Masquerade"

export const CASE_CC001 = {
  caseId: "CC-001",
  title: "The Blackwood Manor Mystery",
  subtitle: "Midnight at the Masquerade",
  date: "October 31, 1927",
  location: "Blackwood Manor, Hudson Valley, New York",
  difficulty: "Standard Investigation",
  estimatedTime: "30-45 Minutes",
  heroImage: "/src/assets/images/manor-hero.svg",
  coverImage: "/src/assets/images/case-cc001-cover.svg",
  victim: {
    name: "Lord Julian Vance",
    age: 48,
    occupation: "Antiquities Tycoon & Speakeasy Financier",
    causeOfDeath: "Acute Cyanide Poisoning (Ingested via vintage spirits)",
    timeOfDeathEstimate: "11:25 PM – 11:35 PM",
    bio: "A ruthless aristocrat who built a fortune on antiquities trade, illegal bootlegging, and extortion. Blackmailed his closest associates and threatened to disinherit his brother."
  },
  synopsis: `On a tempestuous Halloween night in 1927, Lord Julian Vance was found slumped over his mahogany desk in Blackwood Manor. The clock on the mantelpiece stopped at 11:42 PM. The crystal tumbler beside him smells of bitter almonds—the telltale signature of Potassium Cyanide. Three key figures with burning motives remain trapped inside the estate as the storm rages outside.`,

  // Exactly THREE Investigation Locations for CC-001
  locations: [
    {
      id: "study",
      name: "The Private Study",
      zone: "East Wing • Ground Floor",
      description: "The primary crime scene. Dark wainscoting, an iron hearth, a grandfather clock, and Lord Julian's corpse slumped over the leather blotter.",
      icon: "Skull",
      image: "/src/assets/locations/study.svg",
      bgGradient: "from-red-950/30 via-noir-900 to-noir-950",
      mapCoordinates: { x: 68, y: 35 },
      hotspots: [
        {
          id: "hs_desk",
          name: "Julian's Mahogany Desk & Tumbler",
          icon: "UserX",
          description: "Julian's face is frozen in shock. Beside his limp hand lies an ornamental crystal tumbler containing dregs of amber whisky smelling of bitter almonds.",
          clueId: "clue_scotch",
          taskId: "task_corpse"
        },
        {
          id: "hs_clock",
          name: "Stopped Grandfather Clock",
          icon: "Clock",
          description: "The pendulum is frozen at 11:42 PM. Opening the brass casing with a magnifying glass reveals scratch marks on the escapement gear: the hands were deliberately wound back!",
          clueId: "clue_clock",
          taskId: "task_clock"
        },
        {
          id: "hs_rug",
          name: "Persian Rug under Desk",
          icon: "Search",
          description: "Under the embroidered fringe of the rug, a gleaming teardrop earring of South Sea pearl was dropped during a hurried departure.",
          clueId: "clue_earring",
          taskId: null
        }
      ]
    },
    {
      id: "speakeasy",
      name: "The Velvet Cellar",
      zone: "Sub-level • Concealed Wine Vault",
      description: "A clandestine 1920s speakeasy operating beneath the manor. Cigarette smoke clings to the velvet curtains, jazz piano, and mahogany bar.",
      icon: "Wine",
      image: "/src/assets/locations/speakeasy.svg",
      bgGradient: "from-purple-950/30 via-noir-900 to-noir-950",
      mapCoordinates: { x: 30, y: 70 },
      hotspots: [
        {
          id: "hs_piano",
          name: "Backstage Piano & Powder Room",
          icon: "Music",
          description: "On the music stand is Vivienne's marked cabaret score. A discarded fur stole rests on the velvet sofa, still carrying the faint scent of night-blooming jasmine.",
          clueId: null,
          taskId: null
        },
        {
          id: "hs_hearth",
          name: "Cellar Service Hearth & Ash Grate",
          icon: "Flame",
          description: "Sifting through glowing embers in the back hearth reveals a crushed amber apothecary glass vial embossed with 'ST. JUDE HOSPITAL - DR. R. THORNE'. Chemical traces confirm Potassium Cyanide!",
          clueId: "clue_vial",
          taskId: "task_vial"
        }
      ]
    },
    {
      id: "conservatory",
      name: "The Rain-Swept Conservatory",
      zone: "West Wing • Garden Pavilion",
      description: "An expansive glasshouse facing the torrential rain. Exotic ferns, broken glass panes, and cold wind whistling through the garden entrance.",
      icon: "Flower2",
      image: "/src/assets/locations/conservatory.svg",
      bgGradient: "from-emerald-950/30 via-noir-900 to-noir-950",
      mapCoordinates: { x: 22, y: 30 },
      hotspots: [
        {
          id: "hs_window",
          name: "Shattered French Doors",
          icon: "Sparkles",
          description: "A latch was forced open from the garden terrace. Muddy shoe impressions preserve the distinct pattern of a size 10 British wingtip shoe. A bloodstained monogrammed cufflink ('A.V.') clings to the glass shard.",
          clueId: "clue_footprint",
          taskId: "task_conservatory"
        }
      ]
    }
  ],

  // Exactly THREE Suspects for CC-001
  suspects: [
    {
      id: "thorne",
      name: "Dr. Reginald Thorne",
      title: "The Distinguished Physician",
      age: 52,
      role: "Julian's Personal Doctor & Toxicologist",
      avatar: "👨‍⚕️",
      portrait: "/src/assets/suspects/thorne.svg",
      accentColor: "border-emerald-600/50 text-emerald-400",
      bio: "An immaculate, aristocratic gentleman with steady surgeon hands and a sharp intellect. Serves as head toxicologist at St. Jude's Hospital.",
      knownInfo: "Prescribed Julian tonics for chronic insomnia. Arrived at Blackwood Manor carrying a velvet-wrapped bottle of Glenfarclas 1898 scotch as an alleged gift.",
      claimedAlibi: "I was continuously in the downstairs velvet lounge tending to Lady Abernathy's severe migraine from 11:15 PM until the body was discovered.",
      motive: "Julian uncovered that Thorne was siphoning hospital narcotics and laundering forged antiquities. Julian threatened to turn him over to the district attorney at dawn.",
      alibiBroken: false,
      contradictionClueId: "clue_vial",
      dialogue: [
        {
          question: "Doctor Thorne, what brings you to Blackwood Manor tonight?",
          answer: "Julian requested my presence for a medical checkup and to enjoy the masquerade. As his physician for a decade, I attended to his health and his nerves.",
          unlockedNote: "Thorne claims his visit was routine medical consultation and social attendance."
        },
        {
          question: "Where were you between 11:15 PM and 11:45 PM?",
          answer: "In the Velvet Lounge with Lady Abernathy. She had a dreadful migraine. I applied cold compresses and gave her a tincture. I never left her side.",
          unlockedNote: "Thorne asserts an airtight alibi with Lady Abernathy in the lounge from 11:15 to midnight."
        },
        {
          question: "Do you have access to Potassium Cyanide at your hospital?",
          answer: "Cyanide is an industrial and metallurgical poison, detective. A physician heals; he does not dabble in rat poison. To suggest I possessed such a substance is an outrage.",
          unlockedNote: "Thorne categorically denies ever handling or possessing potassium cyanide."
        }
      ],
      confrontation: {
        clue_vial: {
          success: true,
          reaction: "You... you pulled that from the cellar hearth? (His hand twitches, composure cracking). Fine! I went up to Julian's study at 11:25 PM! But it was only to settle our financial disagreement! I didn't pour the poison... wait, you can't prove that!",
          breakdown: "ALIBI BROKEN: Dr. Thorne lied about being in the lounge. He was in the study during the precise window of death with his hospital-grade cyanide!"
        },
        clue_clock: {
          success: true,
          reaction: "The clock? I know nothing of clockwork! Though... Julian always did keep his timepieces eccentric. Why are you staring at my pocket watch screwdriver?",
          breakdown: "Thorne becomes visibly unsettled when confronted about the tampered 11:42 PM clockwork."
        },
        default: {
          success: false,
          reaction: "A curious item, detective, but completely unrelated to my clinical duties. Try questioning someone with actual blood on their hands."
        }
      }
    },
    {
      id: "vivienne",
      name: "Vivienne Fontaine",
      title: "The Siren Chanteuse",
      age: 26,
      role: "Julian's Cabaret Star & Fiancée",
      avatar: "💃",
      portrait: "/src/assets/suspects/vivienne.svg",
      accentColor: "border-purple-600/50 text-purple-400",
      bio: "A magnetic jazz singer in emerald silk and diamonds. Beneath her dazzling stage presence lies a woman fighting for her survival.",
      knownInfo: "Julian held an extortionate indenture contract over her career, threatening to expose her true identity as wanted witness Victoria Grey to the Chicago syndicate.",
      claimedAlibi: "I was singing under the spotlight on the speakeasy bandstand from 11:00 PM until midnight without stepping off the stage.",
      motive: "Julian refused to release her from her contract and threatened her with syndicate hitmen if she attempted to flee Blackwood.",
      alibiBroken: false,
      contradictionClueId: "clue_earring",
      dialogue: [
        {
          question: "Miss Fontaine, how was your relationship with Lord Julian?",
          answer: "Julian treated people like property. He wanted a beautiful canary in a gilded cage. But murder? I prefer to break hearts, not skulls.",
          unlockedNote: "Vivienne describes Julian as controlling and possessive."
        },
        {
          question: "Did you visit Julian's private study tonight?",
          answer: "Never! That gloomy study gives me chills. I haven't set foot in the East Wing all evening.",
          unlockedNote: "Vivienne claims she did not enter the study or the East Wing tonight."
        },
        {
          question: "We heard rumors of a heated argument before midnight.",
          answer: "People talk, darling. Music was blaring, champagne was flowing. Whatever you heard was probably just rehearsal drama.",
          unlockedNote: "Vivienne dismisses reports of an argument as theater rumors."
        }
      ],
      confrontation: {
        clue_earring: {
          success: true,
          reaction: "My South Sea pearl! You found it under the rug? (She gasps, trembling). All right, detective! I went to his study at 11:15 PM to beg for my contract back! He laughed at me. I slapped him and ran out at 11:20 PM! But I swear on my life—he was furious and alive when I left!",
          breakdown: "ALIBI BROKEN: Vivienne admits being in the study at 11:15 PM, but testifies Julian was alive and unharmed when she fled."
        },
        default: {
          success: false,
          reaction: "That belongs to someone else, detective. A girl has to keep up her stage appearances, not inspect junk."
        }
      }
    },
    {
      id: "arthur",
      name: "Arthur Vance",
      title: "The Estranged Brother",
      age: 39,
      role: "Julian's Disinherited Younger Brother",
      avatar: "🎩",
      portrait: "/src/assets/suspects/arthur.svg",
      accentColor: "border-amber-600/50 text-amber-400",
      bio: "A notorious high-stakes gambler with rumpled bespoke tailoring, dark circles under his eyes, and a cut across his right hand.",
      knownInfo: "Owes $50,000 to the Moretti mob due by tomorrow morning. If Julian died before formalizing his new disinheritance will tomorrow, Arthur inherits the entire Vance fortune.",
      claimedAlibi: "I was in the carriage house playing stud poker with the chauffeurs from 10:30 PM until midnight.",
      motive: "Desperation to prevent total disinheritance and obtain the Blackwood estate fortune to pay off his mob debts before dawn.",
      alibiBroken: false,
      contradictionClueId: "clue_footprint",
      dialogue: [
        {
          question: "Arthur, how did you get that cut across your right hand?",
          answer: "A clumsy bartender dropped a siphon of seltzer at the carriage house, detective. Flying glass. Nothing criminal about clumsy soda boys.",
          unlockedNote: "Arthur claims his hand cut came from a broken soda bottle in the carriage house."
        },
        {
          question: "Were you aware Julian planned to disinherit you tomorrow?",
          answer: "Julian was always threatening that. He enjoyed watching me squirm. But blood is thicker than water... or so I hoped.",
          unlockedNote: "Arthur confirms Julian was threatening disinheritance."
        },
        {
          question: "Did you speak to your brother tonight?",
          answer: "He refused to even look at me during the opening toast. Told me to wait in the carriage house like a beggar.",
          unlockedNote: "Arthur denies seeing Julian after the gala toast."
        }
      ],
      confrontation: {
        clue_footprint: {
          success: true,
          reaction: "My cufflink and shoes? Blast it all! Yes, I broke through the conservatory window at 11:35 PM to crack the safe and steal the revised will! But hear me—when I opened the study door, Julian was ALREADY dead in his chair! His skin was blue and cold! I didn't kill him, I only stole the will!",
          breakdown: "ALIBI BROKEN: Arthur admits breaking in at 11:35 PM, but confirms Julian was already dead from the poison when he arrived!"
        },
        default: {
          success: false,
          reaction: "Rubbish! You're trying to frame the family black sheep because it's convenient!"
        }
      }
    }
  ],

  // Exactly FIVE Evidence Items for CC-001
  evidence: [
    {
      id: "clue_scotch",
      name: "Poisoned Crystal Tumbler",
      category: "Forensic",
      badge: "Lethal Weapon",
      locationId: "study",
      locationName: "The Private Study (Julian's Desk)",
      icon: "Skull",
      image: "/src/assets/evidence/scotch.svg",
      imagePlaceholder: "🥃",
      summary: "Crystal tumbler containing Glenfarclas single malt spiked with a fatal concentration of Potassium Cyanide.",
      detail: "Coroner test confirms lethal Potassium Cyanide. Death occurred within 90 seconds of ingestion. The blue discoloration on the victim's lips confirms rapid systemic respiratory failure.",
      linkedSuspectId: "thorne",
      discovered: false
    },
    {
      id: "clue_clock",
      name: "Tampered Grandfather Clock",
      category: "Forensic",
      badge: "Time of Death Proof",
      locationId: "study",
      locationName: "The Private Study (Mantel Clock)",
      icon: "Clock",
      image: "/src/assets/evidence/clock.svg",
      imagePlaceholder: "🕰️",
      summary: "Grandfather clock stopped at 11:42 PM; the internal gears show fresh tool scratches from being manually turned back.",
      detail: "Forensic examination of the escapement mechanism proves someone used a fine watchmaker's flathead to wind the hands back from approx. 11:30 PM to 11:42 PM to fabricate an alibi.",
      linkedSuspectId: "thorne",
      discovered: false
    },
    {
      id: "clue_vial",
      name: "Apothecary Cyanide Vial",
      category: "Physical",
      badge: "Smoking Gun",
      locationId: "speakeasy",
      locationName: "The Velvet Cellar (Service Hearth)",
      icon: "AlertOctagon",
      image: "/src/assets/evidence/vial.svg",
      imagePlaceholder: "🧪",
      summary: "Amber glass medicine vial embossed with 'ST. JUDE HOSPITAL - DR. R. THORNE' found in the hearth ashes.",
      detail: "The heat-resistant apothecary glass survived attempts to incinerate it. Traces of crystalline Potassium Cyanide remain in the neck with Dr. Thorne's clinical inventory code 'TR-8'.",
      linkedSuspectId: "thorne",
      discovered: false
    },
    {
      id: "clue_earring",
      name: "South Sea Pearl Earring",
      category: "Physical",
      badge: "Suspect Presence",
      locationId: "study",
      locationName: "The Private Study (Under Rug)",
      icon: "Gem",
      image: "/src/assets/evidence/earring.svg",
      imagePlaceholder: "💎",
      summary: "Vivienne Fontaine's teardrop pearl earring recovered from beneath the fringe of the study rug.",
      detail: "Matches the emerald and pearl stage jewelry worn by Vivienne Fontaine. Proves she visited Julian's study shortly before the murder, despite claiming she never left the bandstand.",
      linkedSuspectId: "vivienne",
      discovered: false
    },
    {
      id: "clue_footprint",
      name: "Muddy Footprint & Monogram Cufflink",
      category: "Forensic",
      badge: "Infiltration Clue",
      locationId: "conservatory",
      locationName: "The Rain-Swept Conservatory (Terrace Doors)",
      icon: "Footprints",
      image: "/src/assets/evidence/footprint.svg",
      imagePlaceholder: "👞",
      summary: "Size 10 British wingtip shoe impression and a bloody monogrammed cufflink ('A.V.') on the broken window pane.",
      detail: "Matches Arthur Vance's custom footwear and explains the deep laceration across his right palm. Confirms his break-in at 11:35 PM to crack the wall safe.",
      linkedSuspectId: "arthur",
      discovered: false
    }
  ],

  // Shared Room Investigation Tasks
  tasks: [
    {
      id: "task_corpse",
      title: "Inspect Crime Scene & Tumbler",
      description: "Search Julian's desk in the Private Study to determine the exact cause of death.",
      locationId: "study",
      completed: false,
      completedBy: null
    },
    {
      id: "task_clock",
      title: "Analyze Stopped Clockwork",
      description: "Examine the grandfather clock in the Study to verify the true timeline of events.",
      locationId: "study",
      completed: false,
      completedBy: null
    },
    {
      id: "task_conservatory",
      title: "Track the Infiltration Point",
      description: "Investigate the shattered French doors in the Conservatory for signs of forced entry.",
      locationId: "conservatory",
      completed: false,
      completedBy: null
    },
    {
      id: "task_vial",
      title: "Locate the Poison Container",
      description: "Search Blackwood Manor to identify where the killer disposed of the toxic substance.",
      locationId: "speakeasy",
      completed: false,
      completedBy: null
    },
    {
      id: "task_alibi",
      title: "Shatter a Suspect's Alibi",
      description: "Confront a suspect during interrogation with indisputable physical evidence.",
      locationId: null,
      completed: false,
      completedBy: null
    }
  ],

  // Additional Cases for the Case Library Showcase
  caseLibrary: [
    {
      caseId: "CC-001",
      title: "The Blackwood Manor Mystery",
      subtitle: "Midnight at the Masquerade",
      coverImage: "/src/assets/images/case-cc001-cover.svg",
      status: "PLAYABLE NOW",
      difficulty: "Standard",
      era: "1927 • Hudson Valley"
    },
    {
      caseId: "CC-002",
      title: "Murder on the Alps Express",
      subtitle: "Snowbound at St. Moritz",
      coverImage: "/src/assets/images/case-cc002-cover.svg",
      status: "EXPANSION (COMING SOON)",
      difficulty: "Advanced",
      era: "1928 • Swiss Alps"
    },
    {
      caseId: "CC-003",
      title: "The Speakeasy Syndicate Heist",
      subtitle: "Chicago Gangland Betrayal",
      coverImage: "/src/assets/images/case-cc003-cover.svg",
      status: "EXPANSION (COMING SOON)",
      difficulty: "Expert",
      era: "1929 • Chicago"
    }
  ],

  // Authoritative Solution (for validation by backend or mock service)
  authoritativeSolution: {
    culpritId: "thorne",
    culpritName: "Dr. Reginald Thorne",
    murderMethodId: "poison_scotch",
    murderMethodName: "Potassium Cyanide in Glenfarclas Scotch",
    motiveId: "narcotics_blackmail",
    motiveName: "Blackmail over stolen hospital narcotics & antique money laundering (Code TR-8)",
    smokingGunId: "clue_vial",
    smokingGunName: "The Crushed Apothecary Cyanide Vial from St. Jude's Hospital"
  }
};
