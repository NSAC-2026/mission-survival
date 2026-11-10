'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Monitor,
  Trophy,
  Compass,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cockpitAudio } from '@/utils/audio'
import { getScoreState } from '@/lib/score-system'

export interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  actions?: Array<{
    label: string
    route?: string
    modal?: string
    actionId?: string
  }>
}

interface HelpDeskChatbotProps {
  isOpen?: boolean
  onToggle?: () => void
  onOpenManual?: () => void
  onOpenScores?: () => void
  hideFloatingLauncher?: boolean
}

const INITIAL_WELCOME: ChatMessage = {
  id: 'msg-welcome',
  sender: 'ai',
  text: `**GREETINGS, EXPLORER!** I am **Scifi-bot**, your automated AI Flight Assistant & Mission Support.\n\n⚠️ **SYSTEM NOTICE**: *Mission Survival – Beyond Earth* is engineered exclusively as a **PC-based desktop simulation** (requiring keyboard, precision mouse, and widescreen display). It is **NOT compatible with mobile phones or touchscreens**.\n\nHow may I assist your planetary journey today? Select a telemetry topic below or ask any question!`,
  timestamp: 'JUST NOW',
  actions: [
    { label: '🖥️ PC System Requirements', actionId: 'faq-pc' },
    { label: '🏆 Scoring & Rank System', actionId: 'faq-score' },
    { label: '📖 Open Full Game Manual', actionId: 'open-manual' },
  ],
}

const FAQ_SUGGESTIONS = [
  { label: '🖥️ PC Only Notice', query: 'Is this game playable on mobile?' },
  { label: '🏆 Scoring & Ranks', query: 'How does the scoring system and XP work?' },
  { label: '🛡️ Level 1: Solar Storm', query: 'How do I survive the Level 1 solar radiation storm?' },
  { label: '🚀 Level 2: Proton Launch', query: 'How do I clear Level 2 Proton rocket launch?' },
  { label: '🛰️ Level 3: Station Docking', query: 'How do I dock with the space station in Level 3?' },
  { label: '🌕 Level 4: Moon Survival', query: 'How to survive the 14-day Moon night in Level 4?' },
  { label: '🪐 Level 5: Mars Storm', query: 'How to protect the Mars bio-dome in Level 5?' },
  { label: '🎮 Controls & Shortcuts', query: 'What are the keyboard controls and shortcuts?' },
]

export default function HelpDeskChatbot({
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onOpenManual,
  onOpenScores,
  hideFloatingLauncher = false,
}: HelpDeskChatbotProps) {
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isChatOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME])
  const [isTyping, setIsTyping] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isChatOpen) {
      setHasUnread(false)
      scrollToBottom()
    }
  }, [isChatOpen, messages, isTyping])

  const toggleChat = () => {
    if (soundEnabled) cockpitAudio.playClick()
    if (controlledOnToggle) {
      controlledOnToggle()
    } else {
      setInternalIsOpen((prev) => !prev)
    }
  }

  const handleActionClick = (action: { label: string; route?: string; modal?: string; actionId?: string }) => {
    if (soundEnabled) cockpitAudio.playClick()

    if (action.route) {
      router.push(action.route)
      return
    }

    if (action.actionId === 'open-manual') {
      if (onOpenManual) {
        onOpenManual()
      } else {
        router.push('/GAME_MANUAL.md')
      }
      return
    }

    if (action.actionId === 'faq-pc') {
      sendBotResponse(
        `🖥️ **PC EXCLUSIVE SYSTEM NOTICE**:\n\n*Mission Survival – Beyond Earth* is strictly developed and optimized for **PC / Desktop environments** (Windows, macOS, Linux desktop browsers). \n\n• **Hardware Input**: Requires keyboard inputs (arrow keys, numerical throttles, ESC) and precision mouse cursor control for telemetry adjustments.\n• **Viewport**: Designed for 16:9 / 16:10 landscape widescreen monitors (minimum recommended resolution: 1280x720 or 1920x1080).\n• **Mobile Limitation**: Mobile phone browsers, vertical mobile orientations, and touch-only devices are **NOT supported** due to high-density scientific HUD canvas elements and zero-G physics calculation loops.`
      )
      return
    }

    if (action.actionId === 'faq-score') {
      const state = getScoreState()
      sendBotResponse(
        `🏆 **CURRENT MISSION DOSSIER & SCORING MECHANICS**:\n\n• **Total Career XP**: ${state.totalXp.toLocaleString()} XP\n• **Explorer Level**: Level ${state.level}\n• **Starfleet Rank**: ${state.rank}\n• **Level Progress**: ${state.currentLevelXp} / ${state.maxLevelXp} XP to next promotion\n\n**SCORING FORMULA**:\n1. **Level 1 (Solar Storm)**: Up to 1,000 XP (500 base + 500 bonus for 100% 0.02 mSv/h safe shielding).\n2. **Level 2 (Proton Launch)**: Up to 1,500 XP based on stars (500 / 1000 / 1500 XP) and orbital velocity (7.8 km/s).\n3. **Level 3 (ISS Docking)**: Up to 2,000 XP based on alignment precision and fuel conservation (<2.0 m/s closing rate).\n4. **Level 4 (Moon Outpost)**: Up to 1,500 XP for keeping heating >80% and ECLSS oxygen active.\n5. **Level 5 (Mars Bio-Dome)**: Up to 2,000 XP for running emergency sandstorm overrides.\n6. **Daily Challenges**: +500 XP bonus daily!`,
        [
          { label: '🏆 View Full Scoreboard', actionId: 'open-scores' },
          { label: '🚀 Launch Level 1', route: '/level-1' },
        ]
      )
      return
    }

    if (action.actionId === 'open-scores' && onOpenScores) {
      onOpenScores()
      return
    }
  }

  const generateAIAnswer = (query: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase()

    // Mobile vs PC
    if (q.includes('mobile') || q.includes('phone') || q.includes('android') || q.includes('iphone') || q.includes('ipad') || q.includes('tablet')) {
      return {
        text: `⚠️ **NO MOBILE SUPPORT // PC DESKTOP EXCLUSIVE**\n\n*Mission Survival – Beyond Earth* is **NOT playable on mobile devices or smartphones**.\n\n• The game incorporates multi-layered 2D physics canvas simulations, 6-Degrees-of-Freedom thruster matrices, and high-density telemetry dashboards.\n• It strictly requires a **PC desktop or laptop** with physical keyboard & precision mouse controls and a widescreen landscape monitor.\n• Please run the simulation on your desktop computer for the full flight experience!`,
        actions: [{ label: '📖 Read Game Manual', actionId: 'open-manual' }],
      }
    }

    // Scoring & XP
    if (q.includes('score') || q.includes('scoring') || q.includes('xp') || q.includes('rank') || q.includes('points') || q.includes('achievement')) {
      const state = getScoreState()
      return {
        text: `🏆 **STARFLEET SCORING & XP PROGRESSION SYSTEM**:\n\n• **Your Current Score**: ${state.totalXp.toLocaleString()} XP (Level ${state.level} – ${state.rank})\n\n**XP Scoring Breakdown**:\n• **Sector 01 (Radiation Shielding)**: 1,000 pts max. Requires all 3 defense layers (Dosimeter, Water Wall, Bio-Dome Ingress) for Grade S.\n• **Sector 02 (Proton Launch)**: 1,500 pts max (500 pts per star ★ earned for hitting 7.8 km/s stable orbit).\n• **Sector 03 (Space Station Docking)**: 2,000 pts max. Evaluated on soft capture speed (<2.0 m/s), RCS fuel used, and crosshair alignment.\n• **Sector 04 (Moon Artemis)**: 1,500 pts max. Evaluated on keeping crew temperature warm (-130°C outside) and oxygen ECLSS running.\n• **Sector 05 (Mars Settlement)**: 2,000 pts max. Evaluated on electrostatic sand shield integrity and dust filter scrubbers.\n• **Daily Missions**: Claim up to +500 XP every 24 hours!`,
        actions: [
          { label: '🏆 Check Scoreboard', actionId: 'open-scores' },
          { label: '🚀 Play Level 1', route: '/level-1' },
          { label: '🛰️ Play Level 3', route: '/level-3' },
        ],
      }
    }

    // Level 1: Radiation
    if (q.includes('level 1') || q.includes('radiation') || q.includes('hera') || q.includes('solar') || q.includes('storm safe') || q.includes('water wall')) {
      return {
        text: `🛡️ **LEVEL 1 STRATEGY GUIDE: SOLAR STORM SURVIVAL**:\n\n1. **HERA Dosimeter**: Monitor incoming solar particle radiation spikes from coronal mass ejections.\n2. **Crew Ingress**: Direct astronauts from EVA space walk back inside the heavy habitat bunker.\n3. **Water Wall Shield**: Activate hydrogen-rich polyethylene water perimeter tanks to absorb ionizing protons.\n4. **Magnetic Deflection**: Power on the electromagnetic coil field.\n\nWhen all 3 defense layers are active, radiation drops to **0.02 mSv/h (100% SAFE)**, unlocking **Grade S** and advancing to Level 2!`,
        actions: [{ label: '🚀 Go to Level 1', route: '/level-1' }],
      }
    }

    // Level 2: Proton
    if (q.includes('level 2') || q.includes('proton') || q.includes('rocket') || q.includes('orbit') || q.includes('velocity') || q.includes('staging')) {
      return {
        text: `🚀 **LEVEL 2 STRATEGY GUIDE: PROTON ROCKET LAUNCH**:\n\n• **Target Orbital Speed**: You must accelerate to exactly **~7.8 km/s** to establish stable Low Earth Orbit (LEO).\n• **Velocity Warnings**: Below 7.5 km/s, orbital gravity decays and the vehicle plummets back to Earth! Above 8.2 km/s, you enter hyper-escape velocity and overshoot.\n• **Staging**: Monitor Stage 1 booster burnout, separate interstage fairings, and ignite Stage 2 & 3 vacuum thrusters.\n• Hitting 7.8 km/s awards **3 Stars (★★★)** and unlocks Level 3!`,
        actions: [{ label: '🚀 Launch Level 2', route: '/level-2' }],
      }
    }

    // Level 3: Docking
    if (q.includes('level 3') || q.includes('dock') || q.includes('station') || q.includes('rcs') || q.includes('apds') || q.includes('latch')) {
      return {
        text: `🛰️ **LEVEL 3 STRATEGY GUIDE: SPACE STATION DOCKING**:\n\n1. **Zero-G Inertia**: Tap RCS thruster directional keys gently. Spacecraft has inertia and will drift until counter-thrust is applied!\n2. **Alignment Crosshairs**: Keep your docking probe inside the center green target ring.\n3. **Closing Rate**: Keep approach velocity strictly under **2.0 m/s** to prevent kinetic ring collision.\n4. **Hard Lock**: When within range and green crosshair is aligned, press **"ENGAGE STRUCTURAL HARD LATCH"** to seal the 12 APDS motorized hooks!`,
        actions: [{ label: '🛰️ Launch Level 3 Docking', route: '/level-3' }],
      }
    }

    // Level 4: Moon
    if (q.includes('level 4') || q.includes('moon') || q.includes('artemis') || q.includes('shackleton') || q.includes('heating') || q.includes('battery')) {
      return {
        text: `🌕 **LEVEL 4 STRATEGY GUIDE: MOON BASECAMP RESILIENCE**:\n\n• **The Crisis**: The Moon has a **14-day lunar night** with zero solar sunlight! Base battery reserve is critically low at 35%.\n• **Heating Danger**: Outside Shackleton Crater it is **-130°C (-200°F)**! If heating stays at 20%, crew will freeze. Divert thermal heating to **80%**.\n• **ECLSS Oxygen**: Maintain life-support air scrubbers so carbon dioxide (CO₂) does not poison the cabin.\n• Confirm emergency resource allocation to clear Sector 04!`,
        actions: [{ label: '🌕 Enter Level 4', route: '/level-4' }],
      }
    }

    // Level 5: Mars
    if (q.includes('level 5') || q.includes('mars') || q.includes('dust') || q.includes('sand') || q.includes('dome') || q.includes('bio-dome')) {
      return {
        text: `🪐 **LEVEL 5 STRATEGY GUIDE: MARTIAN ATMOSPHERE & SURVIVAL**:\n\n• **Severe Dust Storm**: High-speed abrasive silica dust threatens to scour and breach colonial bio-dome pressure seals.\n• **Action Protocol**: Engage the electrostatic sandstorm deflection grid, seal pressurized airlocks, and execute the automated emergency survival script.\n• Successfully executing the sequence completes the main campaign expedition!`,
        actions: [{ label: '🪐 Enter Level 5', route: '/level-5' }],
      }
    }

    // Controls
    if (q.includes('control') || q.includes('keyboard') || q.includes('keys') || q.includes('esc') || q.includes('how to play')) {
      return {
        text: `🎮 **KEYBOARD & INTERFACE CONTROLS (PC ONLY)**:\n\n• **ESC Key**: Closes active modal dialogs, help desk, and overlays.\n• **Mouse Cursor**: Precision click on telemetry switches, RCS thruster pods, and slider toggles.\n• **RCS Thrusters (Level 3)**: Use directional impulse buttons to align 6-DoF zero-g trajectory.\n• **Sound**: Click Mute/Unmute in System Settings or audio toggles for procedural aerospace sounds.\n• **Paging**: Click Next/Back buttons at the bottom of mission dashboards to navigate sectors.`,
      }
    }

    // Story / Lore
    if (q.includes('story') || q.includes('lore') || q.includes('kepler') || q.includes('who are you') || q.includes('what is this') || q.includes('name')) {
      return {
        text: `🌌 **SCIFI-BOT // MISSION SURVIVAL – BEYOND EARTH**:\n\nI am **Scifi-bot**, your onboard AI flight assistant! Set in the late 21st century, humanity has deployed the Starfleet Deep Space Expedition to colonize **Kepler-452b** and secure permanent outposts on the **Moon (Artemis Base)** and **Mars (Ares Settlement)**.\n\nAs Chief Flight Commander, you manage life-or-death telemetry, survive solar radiation flares, pilot rocket launches, dock orbital stations, and preserve frontier human life beyond Earth.`,
        actions: [{ label: '📖 Open Full Lore & Manual', actionId: 'open-manual' }],
      }
    }

    // Default Fallback
    return {
      text: `📡 **SCIFI-BOT DISPATCH CONFIRMATION**:\n\nTelemetry received regarding: *"${query}"*.\n\n• **Recommendation**: Review our comprehensive **Game Manual** for technical details on orbital physics, life-support formulas, and mission controls.\n• Remember, this simulation is exclusively built for **PC Desktop browsers**.\n• Select one of the quick mission queries below to receive specific flight assistance:`,
      actions: [
        { label: '🖥️ PC System Notice', actionId: 'faq-pc' },
        { label: '🏆 Scoring Mechanics', actionId: 'faq-score' },
        { label: '📖 Open Game Manual', actionId: 'open-manual' },
      ],
    }
  }

  const sendBotResponse = (text: string, actions?: ChatMessage['actions']) => {
    setIsTyping(true)
    setTimeout(() => {
      const newBotMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions,
      }
      setMessages((prev) => [...prev, newBotMsg])
      setIsTyping(false)
      if (soundEnabled) cockpitAudio.playSuccessChime()
      if (!isChatOpen) setHasUnread(true)
    }, 450)
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputMessage.trim()
    if (!trimmed) return

    if (soundEnabled) cockpitAudio.playClick()

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')

    const response = generateAIAnswer(trimmed)
    sendBotResponse(response.text, response.actions)
  }

  const handleQuickQuestion = (query: string) => {
    if (soundEnabled) cockpitAudio.playClick()
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    const response = generateAIAnswer(query)
    sendBotResponse(response.text, response.actions)
  }

  const handleResetChat = () => {
    if (soundEnabled) cockpitAudio.playClick()
    setMessages([INITIAL_WELCOME])
  }

  return (
    <>
      {/* Floating Launcher Button (only rendered if not hidden) */}
      {!hideFloatingLauncher && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 select-none">
          <button
            type="button"
            onClick={toggleChat}
            className={`relative group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-md ${
              isChatOpen
                ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-black/85 text-white/90 border-cyan-400/50 hover:border-cyan-400 hover:bg-black/95 hover:scale-105'
            }`}
            aria-label="Toggle Scifi-bot AI Help Desk"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>

            <Bot className={`w-4 h-4 ${isChatOpen ? 'text-black' : 'text-cyan-400'}`} />

            <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-['Orbitron',sans-serif]">
              {isChatOpen ? 'CLOSE BOT' : 'SCIFI-BOT'}
            </span>

            {hasUnread && !isChatOpen && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                !
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chatbot Terminal Drawer / Modal */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-50 w-[95vw] sm:w-[420px] max-w-[460px] h-[580px] max-h-[85vh] flex flex-col rounded-lg border border-cyan-400/50 bg-black/92 backdrop-blur-xl shadow-[0_0_35px_rgba(34,211,238,0.25)] select-none overflow-hidden animate-in slide-in-from-bottom-5 duration-300 font-['Rajdhani',sans-serif]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-400/30 bg-cyan-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-cyan-400/70 bg-cyan-400/15 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.16em] text-white uppercase font-['Orbitron',sans-serif] flex items-center gap-1.5">
                  SCIFI-BOT
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-cyan-300/80 font-mono tracking-wide flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-cyan-400 inline" /> AI FLIGHT ASSISTANT • PC ONLY
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="w-7 h-7 rounded border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-colors"
                title={soundEnabled ? 'Mute AI sounds' : 'Enable AI sounds'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
              </button>

              {/* Reset Chat */}
              <button
                type="button"
                onClick={handleResetChat}
                className="w-7 h-7 rounded border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={toggleChat}
                className="w-7 h-7 rounded border border-white/10 hover:border-cyan-400 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-colors"
                title="Close Scifi-bot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PC Notice Banner */}
          <div className="px-3.5 py-1.5 bg-cyan-950/40 border-b border-cyan-400/20 flex items-center justify-between text-[10px] text-cyan-300/90 font-mono">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>NOTICE: Strictly PC-based. Mobile devices unsupported.</span>
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-white/80 scrollbar-thin scrollbar-thumb-cyan-500/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[9.5px] font-mono text-white/40">
                  {msg.sender === 'ai' ? (
                    <>
                      <Bot className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300/80 font-semibold font-['Orbitron',sans-serif]">SCIFI-BOT</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-300/80 font-semibold font-['Orbitron',sans-serif]">COMMANDER</span>
                    </>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] p-3 rounded-lg leading-relaxed whitespace-pre-line text-xs ${
                    msg.sender === 'user'
                      ? 'bg-amber-400/15 border border-amber-400/40 text-amber-100 rounded-br-none shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                      : 'bg-black/60 border border-cyan-400/25 text-white/90 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}

                  {/* Optional Action Chips inside AI message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1 rounded bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/10 w-fit text-[11px] text-cyan-400 font-mono">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span className="animate-pulse">Scifi-bot is processing telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills Slider */}
          <div className="px-3 py-2 bg-black/50 border-t border-white/10 overflow-x-auto flex gap-1.5 scrollbar-none">
            {FAQ_SUGGESTIONS.map((faq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestion(faq.query)}
                className="shrink-0 px-2.5 py-1 rounded-full border border-white/15 hover:border-cyan-400 bg-white/5 hover:bg-cyan-400/10 text-[10px] text-white/70 hover:text-cyan-300 font-mono transition-colors whitespace-nowrap"
              >
                {faq.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-cyan-400/25 bg-black/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Scifi-bot about levels, controls, scoring, physics..."
              className="flex-1 bg-black/60 border border-white/20 focus:border-cyan-400 focus:outline-none rounded px-3 py-2 text-xs text-white placeholder-white/35 font-mono"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-black font-bold rounded flex items-center justify-center transition-colors shadow-md"
              title="Transmit query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
