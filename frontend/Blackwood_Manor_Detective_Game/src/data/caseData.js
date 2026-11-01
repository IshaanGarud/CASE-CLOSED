// 1920s Noir Mystery Case Data: "The Blackwood Manor Mystery"

export const CASE_METADATA = {
  title: "The Blackwood Manor Mystery",
  subtitle: "Midnight at the Masquerade",
  date: "October 31, 1927",
  location: "Blackwood Manor, Hudson Valley",
  victim: {
    name: "Lord Julian Vance",
    age: 48,
    occupation: "Antiquities Tycoon & Speakeasy Financier",
    causeOfDeath: "Acute Cyanide Poisoning (Coroner suspects ingested via vintage spirits)",
    timeOfDeathEstimate: "Between 11:20 PM and 11:45 PM",
    bio: "A ruthless aristocrat who built an empire on blackmail, bootlegging, and antiquities trade. Feared by his associates and hated by his family."
  },
  initialBriefing: `The storm outside rattles the leaded glass of Blackwood Manor. Downstairs, the jazz band from the speakeasy has gone silent. At 12:05 AM, the butler discovered Lord Julian Vance slumped over his mahogany desk in the locked private study.

The grandfather clock in the corner stopped abruptly at 11:42 PM. An ornate crystal tumbler lies shattered near the fireplace, smelling distinctly of bitter almonds.

Four guests with urgent motives remain sequestered in the drawing room. As the night constable seals the iron gates, you have until dawn (6 Investigation Hours) to search the rooms, interrogate the suspects, pierce their alibis, and name the killer.`
};

export const SUSPECTS = [
  {
    id: "thorne",
    name: "Dr. Reginald Thorne",
    title: "The Distinguished Physician",
    relation: "Julian's Personal Doctor & Toxicology Specialist",
    age: 52,
    avatar: "👨‍⚕️",
    accentColor: "border-emerald-600/40 text-emerald-400",
    bgGradient: "from-emerald-950/40 to-noir-900",
    overview: "Polished, composed, and smelling of clinical carbolic acid and fine lavender pomade. His hands never tremble, even under questioning.",
    motive: "Julian discovered Dr. Thorne was siphoning medical-grade narcotics and laundering counterfeit artifacts through Vance Galleries. Julian threatened to report him to the State Medical Board at dawn.",
    claimedAlibi: "I was in the downstairs lounge attending to Lady Abernathy's chronic migraine continuously from 11:15 PM until midnight.",
    suspicionScore: 30,
    alibiBroken: false,
    contradictionClueId: "clue_vial",
    interrogations: [
      {
        question: "Doctor, where were you between 11:15 PM and 11:45 PM tonight?",
        response: "A physician's duties never cease, detective. Lady Abernathy took ill with a migraine around 11:15. I remained by her side in the velvet lounge with a cold compress until the sirens howled.",
        unlockedNote: "Thorne claims an airtight alibi with Lady Abernathy from 11:15 to midnight."
      },
      {
        question: "What was your medical relationship with Julian?",
        response: "Julian suffered from insomnia and mild gout. I prescribed him mild tonics. Nothing stronger. He was high-strung, irritable, and paranoid of late.",
        unlockedNote: "Prescribed Julian tonics for insomnia; claims relationship was purely clinical."
      },
      {
        question: "We found traces of Potassium Cyanide in the crystal tumbler. Do you stock such compounds?",
        response: "Cyanide? In my private practice? Preposterous. That is a metallurgical poison or an industrial pesticide. Any rat-catcher in the valley could acquire it.",
        unlockedNote: "Thorne vehemently denies ever possessing or working with potassium cyanide."
      }
    ],
    confrontationReactions: {
      clue_vial: {
        success: true,
        dialogue: "You... you searched the fireplace grate? That vial... fine! I visited Julian at 11:25 PM! But it was strictly business! I didn't pour the poison! Wait... don't look at me like that!",
        breakdown: "ALIBI CRACKED: Dr. Thorne's claimed presence in the lounge was a lie. He was in the study at the exact estimated time of death!"
      },
      clue_scotch: {
        success: true,
        dialogue: "Glenfarclas 1898... that was Julian's favorite reserve. I may have shared a glass earlier in the evening, but I swear he was breathing when I departed!",
        breakdown: "Thorne admits to drinking from the vintage bottle with Julian."
      },
      default: {
        success: false,
        dialogue: "Fascinating theory, detective, but irrelevant to a man of science. Show me tangible proof, not parlor guesswork."
      }
    }
  },
  {
    id: "vivienne",
    name: "Vivienne Fontaine",
    title: "The Siren Chanteuse",
    relation: "Julian's Fiancée & Speakeasy Star",
    age: 26,
    avatar: "💃",
    accentColor: "border-purple-600/40 text-purple-400",
    bgGradient: "from-purple-950/40 to-noir-900",
    overview: "A mesmerizing cabaret singer wearing emerald silk and a fox stole. Behind her smoky gaze lies the sharp instinct of a survivor.",
    motive: "Julian held an extortionate indenture contract over her. He possessed documents proving her real identity was Victoria Grey, an escaped witness wanted by the Chicago Syndicate.",
    claimedAlibi: "I was under the spotlight at the cellar speakeasy, singing three encore sets without leaving the bandstand between 11:00 PM and midnight.",
    suspicionScore: 40,
    alibiBroken: false,
    contradictionClueId: "clue_earring",
    interrogations: [
      {
        question: "Miss Fontaine, were you and Lord Julian on good terms before tonight?",
        response: "Julian was... possessive, darling. He believed a contract could buy someone's soul. But murder? I prefer to leave my admirers heartbroken, not dead.",
        unlockedNote: "Admits Julian was possessive and held contracts over her."
      },
      {
        question: "Did you ever enter Julian's private study during the gala?",
        response: "Never! That room gives me the shivers. The heavy mahogany, the taxidermy eyes... I haven't set foot in his private den all week.",
        unlockedNote: "Vivienne claims she has not stepped foot in the private study all week."
      },
      {
        question: "Your contract was found in his drawer. Were you trying to retrieve it?",
        response: "Every performer dreams of breaking free from a cage. But Julian kept that drawer triple-locked. I wouldn't even know how to begin picking it.",
        unlockedNote: "Admits she wanted her contract back, but claims no knowledge of how to access the desk."
      }
    ],
    confrontationReactions: {
      clue_earring: {
        success: true,
        dialogue: "My... my South Sea pearl! You found it under the rug? (She bites her lip). All right, detective! I went up at 11:10 PM. I begged him on my knees to burn my dossier. He laughed in my face. I slapped him and my earring flew off. But when I ran out at 11:20 PM, he was furious, alive, and pouring himself a drink!",
        breakdown: "Vivienne admits she was in the study at 11:15 PM, but Julian was alive and unharmed when she left."
      },
      clue_contract: {
        success: true,
        dialogue: "You saw Victoria Grey on the paper? Yes... that is my past. Julian was threatening to sell my location to Don Falcone if I didn't marry him next Tuesday. He was a monster, but I didn't poison him!",
        breakdown: "Confirmed motive: Julian was blackmailing her with the mob."
      },
      default: {
        success: false,
        dialogue: "A charming trinket, detective, but it proves nothing about my singing or my night."
      }
    }
  },
  {
    id: "arthur",
    name: "Arthur Vance",
    title: "The Estranged Brother",
    relation: "Julian's Younger Brother & Disinherited Heir",
    age: 39,
    avatar: "🎩",
    accentColor: "border-amber-600/40 text-amber-400",
    bgGradient: "from-amber-950/40 to-noir-900",
    overview: "Smelling of gin and expensive tobacco, Arthur wears rumpled tailored suits. A notorious high-roller with dark circles under his twitching eyes.",
    motive: "Owes $50,000 to the Moretti mob with a deadline of dawn. If Julian died before filing his new disinheritance testament tomorrow, Arthur inherits the entire Vance estate.",
    claimedAlibi: "I was playing stud poker in the carriage house with the chauffeurs from 10:30 PM until midnight. Ask any of the lads.",
    suspicionScore: 50,
    alibiBroken: false,
    contradictionClueId: "clue_bootprint",
    interrogations: [
      {
        question: "Arthur, how did you get that cut across your right palm?",
        response: "A clumsy bartender dropped a siphon of seltzer at the carriage house, detective. Splintered glass. Nothing more sinister than cheap soda bottles.",
        unlockedNote: "Claims cut on his palm was from broken seltzer bottle in carriage house."
      },
      {
        question: "Did you talk to your brother Julian tonight?",
        response: "Julian wouldn't grant me two minutes. Told me I was a leech and that tomorrow morning his lawyers would formally cut me off from the trust fund forever.",
        unlockedNote: "Reveals Julian was scheduled to sign disinheritance papers the next morning."
      },
      {
        question: "Your brother's wall safe was found forced open. Did you know the combination?",
        response: "Only Julian and his precious secretary knew the numbers. If someone blew that safe, they're either a professional yegg or someone who had the key.",
        unlockedNote: "Arthur denies knowing the safe combination."
      }
    ],
    confrontationReactions: {
      clue_bootprint: {
        success: true,
        dialogue: "Damn those garden beds! Fine, you caught me! I came through the conservatory at 11:35 PM to crack the safe and snatch the new will before the lawyers arrived! I cut my hand on the window latch! But detective—swear on my mother's grave—when I opened the study door, Julian was already dead in his chair! His eyes were glassy! I panicked, grabbed the cash and will, and ran!",
        breakdown: "Arthur confesses to the burglary at 11:35 PM, but testifies that Julian was ALREADY dead from the poison when he arrived!"
      },
      clue_cuff: {
        success: true,
        dialogue: "My cuff? Yes, there was blood from the broken glass pane. But I didn't poison him! I don't know the first thing about chemistry, I'm a roulette man!",
        breakdown: "Arthur admits his blood was from breaking through the conservatory."
      },
      default: {
        success: false,
        dialogue: "Rubbish! You're trying to pin your murder badge on the family black sheep!"
      }
    }
  },
  {
    id: "evelyn",
    name: "Evelyn Cross",
    title: "The Quiet Secretary",
    relation: "Julian's Confidential Clerk & Bookkeeper",
    age: 31,
    avatar: "👓",
    accentColor: "border-sky-600/40 text-sky-400",
    bgGradient: "from-sky-950/40 to-noir-900",
    overview: "Impeccably organized with neat round spectacles and ink-stained fingertips. Quiet, observational, and possessing keys to every lock in Blackwood.",
    motive: "Julian discovered $15,000 missing from the speakeasy books and planned to deliver Evelyn to the district attorney on Monday.",
    claimedAlibi: "I retired to my second-floor office room at 10:30 PM with a cup of chamomile tea to transcribe dictation cylinders.",
    suspicionScore: 35,
    alibiBroken: false,
    contradictionClueId: "clue_keys",
    interrogations: [
      {
        question: "Miss Cross, who had access to the master keys to the study?",
        response: "Only Lord Julian and myself. I keep my brass master ring locked in my secretary roll-top at all times.",
        unlockedNote: "Confirms only she and Julian had master keys to the study."
      },
      {
        question: "Did you notice anything unusual about Julian's liquor cabinet tonight?",
        response: "Yes... Lord Julian rarely drank the Glenfarclas single malt unless an honored guest brought it. Earlier this evening, Dr. Thorne arrived carrying a velvet-wrapped bottle from his private collection.",
        unlockedNote: "Reveals Dr. Thorne personally brought the vintage Glenfarclas bottle tonight!"
      },
      {
        question: "Why were ledger pages found burning in the library fireplace?",
        response: "Lord Julian asked me to purge outdated 1924 manifests... or so I was instructed. Nothing of consequence, just routine housekeeping.",
        unlockedNote: "Evading questions regarding the burnt financial ledgers."
      }
    ],
    confrontationReactions: {
      clue_keys: {
        success: true,
        dialogue: "You found my duplicate skeleton keys? (She pushes her glasses up, sighing). Very well. Julian was going to blame me for his fraudulent accounts. At 11:50 PM, I unlocked the study to retrieve the incriminating ledger books. When I opened the door... he was already cold. The decanter was tipped over. I burned the pages in the library grate and fled.",
        breakdown: "Evelyn admitted to entering the study at 11:50 PM to burn evidence, but found Julian already dead."
      },
      clue_ledger: {
        success: true,
        dialogue: "Yes, those numbers represent illegal transfers. But not by me alone! Look closer at the account codes—'TR-8' belongs to Dr. Thorne's pharmaceutical imports!",
        breakdown: "Evelyn reveals code 'TR-8' links the stolen speakeasy funds directly to Dr. Thorne!"
      },
      default: {
        success: false,
        dialogue: "That document has no bearing on my clerical duties, detective."
      }
    }
  }
];

export const LOCATIONS = [
  {
    id: "study",
    name: "The Private Study",
    tagline: "Crime Scene • Heavy Mahogany & Cigar Smoke",
    description: "The primary scene of the murder. Dark wainscoting, a roaring hearth, a grandfather clock, and Julian's corpse resting face down across the leather blotter.",
    icon: "Skull",
    bgPattern: "from-red-950/20 via-noir-900 to-noir-950",
    hotspots: [
      {
        id: "hs_body",
        name: "Julian's Corpse & Desk",
        icon: "UserX",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_scotch",
        evidenceTitle: "Poisoned Crystal Glass",
        inspectionText: "Julian's face is frozen in a grimace of shock. Near his limp right hand rests an ornamental crystal tumbler. The dregs of amber whisky smell faintly of bitter almonds. The coroner swab reveals Potassium Cyanide."
      },
      {
        id: "hs_clock",
        name: "Stopped Grandfather Clock",
        icon: "Clock",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_clock",
        evidenceTitle: "Tampered Clock Mechanism",
        inspectionText: "The grandfather clock's pendulum is frozen at 11:42 PM. Opening the brass casing with your magnifying glass reveals fresh scratches on the escapement gear: the hands were deliberately wound backwards by someone to falsify the time of death!"
      },
      {
        id: "hs_carpet",
        name: "Persian Rug Beneath Desk",
        icon: "Search",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_earring",
        evidenceTitle: "Pearl Teardrop Earring",
        inspectionText: "Kneeling beside the desk, your flashlight catches an iridescent shimmer under the fringe of the Persian rug: an exquisite South Sea pearl earring, matching the stage jewelry worn by Vivienne Fontaine."
      },
      {
        id: "hs_safe",
        name: "Forced Wall Safe Behind Painting",
        icon: "ShieldAlert",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_safe",
        evidenceTitle: "Pried Wall Safe & Stolen Will",
        inspectionText: "Behind a Renaissance oil portrait lies the concealed wall safe. The dial was bypassed with a steel pry-bar. Inside is an empty velvet jewelry box and a draft testament where Arthur Vance was to be completely disinherited."
      }
    ]
  },
  {
    id: "speakeasy",
    name: "The Velvet Cellar",
    tagline: "Underground Speakeasy • Jazz Bandstand & Wet Bar",
    description: "Hidden behind the wine racks beneath Blackwood Manor. Jazz trumpets and cigarette haze linger where the high-society masqueraders gathered.",
    icon: "Wine",
    bgPattern: "from-purple-950/20 via-noir-900 to-noir-950",
    hotspots: [
      {
        id: "hs_piano",
        name: "Dressing Room & Stage Piano",
        icon: "Music",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_contract",
        evidenceTitle: "Indenture Dossier on Victoria Grey",
        inspectionText: "Tucked inside the piano bench is a sealed leather portfolio bearing Julian's wax crest. Inside are newspaper clippings from Chicago: Vivienne Fontaine's true name is Victoria Grey, a fugitive from the mob whom Julian was blackmailing into marriage."
      },
      {
        id: "hs_bar",
        name: "Private VIP Liquor Cellar",
        icon: "GlassWater",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_telegram",
        evidenceTitle: "Confidential Chicago Telegram",
        inspectionText: "Underneath the bar ledger lies an encrypted telegram received at 8:00 PM: 'FEDERAL REVENUE AGENTS EN ROUTE HUDSON VALLEY. INSPECTION AT DAWN. PREPARE BOOKS.'"
      }
    ]
  },
  {
    id: "library",
    name: "The Grand Library & Hearth",
    tagline: "Floor-to-Ceiling Shelves • Ash in the Grate",
    description: "A labyrinth of antique folios, green banker lamps, and a stone hearth where smoke still curls toward the dark vaulted ceiling.",
    icon: "BookOpen",
    bgPattern: "from-amber-950/20 via-noir-900 to-noir-950",
    hotspots: [
      {
        id: "hs_fireplace",
        name: "Library Fireplace Grate",
        icon: "Flame",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_vial",
        evidenceTitle: "Crushed Amber Apothecary Vial",
        inspectionText: "Sifting through the glowing embers with brass tongs reveals the shattered base of an amber medicinal vial. The embossed glass reads: 'ST. JUDE HOSPITAL - DR. R. THORNE - TOXICOLOGY DEPOT'. Chemical analysis confirms cyanide residue!"
      },
      {
        id: "hs_secretary_desk",
        name: "Secretary's Roll-Top Desk",
        icon: "Key",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_keys",
        evidenceTitle: "Master Skeleton Key Ring",
        inspectionText: "Hidden inside a hollowed-out volume of 'The Count of Monte Cristo' is a ring of duplicate brass skeleton keys capable of opening any door in Blackwood Manor, including Julian's private study."
      },
      {
        id: "hs_ash",
        name: "Half-Burned Ledger Scraps",
        icon: "FileText",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_ledger",
        evidenceTitle: "Scorched Embezzlement Ledger",
        inspectionText: "A scorched fragment of paper saved from the flames records monthly payments under account 'TR-8' totaling $40,000 for 'Special Chemical Shipments' tied to Dr. Reginald Thorne."
      }
    ]
  },
  {
    id: "conservatory",
    name: "The Rain-Swept Conservatory",
    tagline: "Exotic Palms • Broken Glass & Muddy Earth",
    description: "The glass greenhouse connecting the manor to the outer gardens. Rain hammers relentlessly upon the iron rafters while cold draft gusts inside.",
    icon: "Flower2",
    bgPattern: "from-emerald-950/20 via-noir-900 to-noir-950",
    hotspots: [
      {
        id: "hs_window",
        name: "Shattered French Doors",
        icon: "Sparkles",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_bootprint",
        evidenceTitle: "Muddy Wingtip Footprint",
        inspectionText: "On the terrace tile, fresh garden mud preserves the sharp tread of a size 10 British wingtip shoe, identical to the custom footwear worn by Julian's brother Arthur."
      },
      {
        id: "hs_ivy",
        name: "Brambles by the Window Latch",
        icon: "Shirt",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_cuff",
        evidenceTitle: "Bloodstained Silk Cufflink",
        inspectionText: "Snagged on the jagged glass edge of the prying window is a monogrammed gold cufflink ('A.V.') with wet human blood from a sliced palm."
      },
      {
        id: "hs_cabinet",
        name: "Antique Weapon Display Case",
        icon: "Sword",
        costHours: 0.5,
        examined: false,
        clueReward: "clue_knife",
        evidenceTitle: "Clean Damascus Dagger",
        inspectionText: "An ornamental 16th-century dagger rests on velvet. Though removed from its case earlier tonight, the blade has zero blood or poison residue. It was a decoy or abandoned plan."
      }
    ]
  }
];

export const CLUES = [
  {
    id: "clue_scotch",
    name: "Poisoned Crystal Tumbler",
    category: "Forensic",
    badge: "Lethal Weapon",
    summary: "Crystal tumbler containing dregs of 1898 Glenfarclas scotch laced with Potassium Cyanide.",
    detail: "Chemical swab confirms a fatal lethal concentration of Potassium Cyanide. Death occurred within 90 seconds of ingestion. Julian's lips show characteristic blue tint.",
    critical: true,
    linkedSuspect: "thorne",
    icon: "Skull"
  },
  {
    id: "clue_clock",
    name: "Tampered Clockwork",
    category: "Forensic",
    badge: "Key Alibi Proof",
    summary: "The grandfather clock stopped at 11:42 PM, but the gears were manually wound back.",
    detail: "Microscopic tool marks on the escapement ratchet prove the killer forced the hands back from approx. 11:30 PM to 11:42 PM to fabricate an alibi matching Thorne's claimed presence in the lounge.",
    critical: true,
    linkedSuspect: "thorne",
    icon: "Clock"
  },
  {
    id: "clue_vial",
    name: "Apothecary Vial (St. Jude's)",
    category: "Forensic",
    badge: "Smoking Gun",
    summary: "Amber glass vial embossed with Dr. Thorne's toxicology clinic stamp; contained cyanide.",
    detail: "Found inside the library fireplace grate. Dr. Thorne attempted to incinerate the evidence, but the heat-resistant apothecary glass survived with his hospital code 'TR-8' intact.",
    critical: true,
    linkedSuspect: "thorne",
    icon: "AlertOctagon"
  },
  {
    id: "clue_earring",
    name: "Pearl Teardrop Earring",
    category: "Physical",
    badge: "Suspect Placement",
    summary: "Vivienne Fontaine's earring discovered hidden beneath the study rug.",
    detail: "Matches Vivienne's cabaret jewelry. Proves she visited Julian in the study, though testimony indicates she departed before 11:20 PM.",
    critical: false,
    linkedSuspect: "vivienne",
    icon: "Gem"
  },
  {
    id: "clue_contract",
    name: "Victoria Grey Blackmail Dossier",
    category: "Document",
    badge: "Motive Document",
    summary: "Julian's extortion file on Vivienne's syndicate past in Chicago.",
    detail: "Establishes a powerful motive for Vivienne, who faced forced marriage or execution by Chicago bootleggers if the file leaked.",
    critical: false,
    linkedSuspect: "vivienne",
    icon: "FileLock2"
  },
  {
    id: "clue_bootprint",
    name: "Muddy Wingtip Footprint",
    category: "Forensic",
    badge: "Suspect Placement",
    summary: "Size 10 British wingtip footprint leading from the conservatory into the study.",
    detail: "Matches Arthur Vance's shoes. Proves Arthur entered through the garden window at 11:35 PM to plunder the wall safe.",
    critical: false,
    linkedSuspect: "arthur",
    icon: "Footprints"
  },
  {
    id: "clue_cuff",
    name: "Bloodstained Silk Cufflink",
    category: "Physical",
    badge: "Injury Evidence",
    summary: "Monogrammed 'A.V.' cufflink stained with blood from the broken greenhouse glass.",
    detail: "Explains Arthur's palm laceration. Corroborates that he broke in, but his timing placed him in the room after the cyanide had already killed Julian.",
    critical: false,
    linkedSuspect: "arthur",
    icon: "Tag"
  },
  {
    id: "clue_safe",
    name: "Pried Wall Safe & Stolen Will",
    category: "Physical",
    badge: "Crime Scene",
    summary: "Julian's personal safe pried open; the revised disinheritance draft was stolen.",
    detail: "Arthur pried the safe to save himself from bankruptcy, unaware his brother was already poisoned in the chair.",
    critical: false,
    linkedSuspect: "arthur",
    icon: "Lock"
  },
  {
    id: "clue_keys",
    name: "Duplicate Skeleton Keys",
    category: "Physical",
    badge: "Access Evidence",
    summary: "Set of master keys hidden in Evelyn Cross's hollow desk book.",
    detail: "Allowed Evelyn secret access to the study at 11:50 PM to burn the embezzlement accounts.",
    critical: false,
    linkedSuspect: "evelyn",
    icon: "Key"
  },
  {
    id: "clue_ledger",
    name: "Scorched Embezzlement Ledger",
    category: "Document",
    badge: "Financial Link",
    summary: "Accounts linking $40,000 in diverted funds under account code 'TR-8' to Dr. Thorne.",
    detail: "Provides the underlying financial motive: Julian was blackmailing Dr. Thorne with federal prosecution for medical fraud and money laundering.",
    critical: true,
    linkedSuspect: "thorne",
    icon: "FileSpreadsheet"
  },
  {
    id: "clue_knife",
    name: "Damascus Dagger (Clean)",
    category: "Physical",
    badge: "Red Herring",
    summary: "An antique dagger found removed from its display box, completely untouched by blood.",
    detail: "Arthur initially drew the dagger for intimidation, but dropped it in horror upon finding Julian already dead.",
    critical: false,
    linkedSuspect: "arthur",
    icon: "Sword"
  },
  {
    id: "clue_telegram",
    name: "Urgent Chicago Federal Telegram",
    category: "Document",
    badge: "Timeline Clue",
    summary: "Warning of federal agents arriving at dawn to seize Vance's records.",
    detail: "Prompted Julian to summon Thorne and Evelyn tonight for high-stakes blackmail confrontations before dawn.",
    critical: false,
    linkedSuspect: "evelyn",
    icon: "Mail"
  }
];

export const TIMELINE_EVENTS = [
  { time: "10:00 PM", title: "Masquerade Begins", desc: "Guests gather in the velvet cellar and grand ballroom. Julian toasts his guests with champagne." },
  { time: "10:30 PM", title: "Evelyn Departs", desc: "Evelyn Cross claims to retire to her private quarters with transcription cylinders." },
  { time: "11:15 PM", title: "Vivienne's Scuffle", desc: "Vivienne confronts Julian in the study over her contract. Slaps him, losing her pearl earring. Julian is very much alive." },
  { time: "11:28 PM", title: "The Lethal Toast", desc: "Dr. Thorne enters the study carrying vintage Glenfarclas scotch spiked with cyanide. Julian collapses within 90 seconds." },
  { time: "11:32 PM", title: "Alibi Forgery", desc: "Thorne forces the clock hands back to 11:42 PM to create an alibi, throws vial in the library hearth, and sneaks back to the lounge." },
  { time: "11:35 PM", title: "Arthur's Break-In", desc: "Arthur breaks through conservatory window, cuts his hand, discovers Julian dead, panics, cracks the safe to snatch the will, and flees." },
  { time: "11:50 PM", title: "Evelyn's Cover-Up", desc: "Evelyn uses duplicate skeleton key to enter study, discovers corpse, snatches ledger, and burns it in the library." },
  { time: "12:05 AM", title: "Body Discovered", desc: "Midnight chimes; butler enters with late-night coffee and raises the alarm. Detective arrives." }
];

export const DEDUCTION_OPTIONS = {
  culprits: [
    { id: "thorne", label: "Dr. Reginald Thorne (The Physician)", isCorrect: true },
    { id: "vivienne", label: "Vivienne 'The Siren' Fontaine (The Chanteuse)", isCorrect: false },
    { id: "arthur", label: "Arthur Vance (The Estranged Brother)", isCorrect: false },
    { id: "evelyn", label: "Evelyn Cross (The Secretary)", isCorrect: false }
  ],
  weapons: [
    { id: "poison_scotch", label: "Potassium Cyanide in the Vintage Glenfarclas Scotch", isCorrect: true },
    { id: "damascus_dagger", label: "The Damascus Ornamental Dagger", isCorrect: false },
    { id: "strangulation", label: "Silk Scarf Strangulation", isCorrect: false },
    { id: "blunt_force", label: "Blunt force from the brass clock casing", isCorrect: false }
  ],
  motives: [
    { id: "narcotics_blackmail", label: "Blackmail over stolen hospital narcotics & fraudulent antique laundering (Code TR-8)", isCorrect: true },
    { id: "chicago_mob", label: "Escaping forced marriage and Chicago syndicate execution", isCorrect: false },
    { id: "inheritance_debt", label: "Inheriting the estate before being disinherited to settle a $50,000 mob debt", isCorrect: false },
    { id: "routine_theft", label: "Simple robbery of the wall safe jewels and bonds", isCorrect: false }
  ],
  smokingGuns: [
    { id: "clue_vial", label: "The Crushed Apothecary Vial from St. Jude's Hospital with Cyanide residue", isCorrect: true },
    { id: "clue_earring", label: "The South Sea Pearl Teardrop Earring under the desk", isCorrect: false },
    { id: "clue_bootprint", label: "The Muddy Size 10 Wingtip Footprint in the conservatory", isCorrect: false },
    { id: "clue_keys", label: "The duplicate brass skeleton keys in the hollow book", isCorrect: false }
  ]
};

