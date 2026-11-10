# MISSION SURVIVAL – BEYOND EARTH
## Official Master Flight Manual, System Architecture & Operational Guide

---

> [!IMPORTANT]
> **PLATFORM REQUIREMENT: PC DESKTOP EXCLUSIVE**  
> **Mission Survival – Beyond Earth** is an aerospace simulation game engineered **exclusively for PC desktop computers** (Windows, macOS, Linux desktop browsers).  
> - **NOT SUPPORTED ON MOBILE**: Smartphones, mobile phone browsers, tablets, and small touchscreens are strictly unsupported due to high-density scientific telemetry displays, multi-layered HTML5 2D Canvas orbital physics loops, and precision 6-Degrees-of-Freedom control schemes.  
> - **Required Hardware**: Physical keyboard, precision mouse pointer, and a landscape widescreen monitor (1920×1080 or 1280×720 minimum).

---

## 1. Game Overview & Lore

Set in the late 21st century, humanity has initiated the **Deep Space Starfleet Initiative**, establishing human colonies across the Solar System and probing deep into the **Kepler-452b (Sector 7G)** star system.

As **Chief Flight Commander & Lead Aerospace Specialist**, you are tasked with piloting missions, surviving catastrophic space weather phenomena, managing life support under hostile conditions, docking with orbital infrastructure, and securing humanity's permanent survival beyond Earth.

The game seamlessly combines:
- Real-world astrophysics and Keplerian orbital mechanics.
- NASA OSDR microgravity biological data & live NASA DONKI space weather telemetry.
- Procedural aerospace audio synthesis via the Web Audio API.
- Deep survival management across the Moon, Mars, and orbital waystations.

---

## 2. System Architecture & Tech Stack

The application is built on cutting-edge web technologies inside the `msbe` project directory:

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.4 (App Router) | High-performance React framework with Turbopack |
| **UI Library** | React 19.3.0 | Modern concurrent React component architecture |
| **Styling** | Tailwind CSS v4 & Custom Sci-Fi HUD CSS | Retro-futuristic amber/cyan glassmorphic HUD styling |
| **Fonts** | Google Fonts: Orbitron & Rajdhani | Aerospace military typography |
| **Simulation** | HTML5 2D Canvas Engine | Custom orbital trajectories, Keplerian vectors & particle systems |
| **Audio** | Web Audio API (`audio.ts`) | Procedural synthesizer generating clicks, thrusters, and chimes |
| **Space Weather** | NASA DONKI API (`nasaDonki.ts`) | Live Coronal Mass Ejection (CME) and solar flare alerts |
| **State & Scores**| Centralized Scoring System (`score-system.ts`) | Persistent XP, Ranks, Levels, and Badges in `localStorage` |
| **AI Support** | Starfleet AI Help Desk (`HelpDeskChatbot.tsx`) | In-game intelligent flight assistant (AURA-9) |

---

## 3. Campaign Sectors & Level Walkthrough

The game features 5 distinct campaign sectors. In compliance with flight regulations, sectors unlock sequentially as you qualify each mission:

```
[ Sector 01: Astronaut Profile & Solar Storm ] 
                      ↓
[ Sector 02: Proton Rocket Launch & Orbit ] 
                      ↓
[ Sector 03: Space Station APDS Docking ] 
                      ↓
[ Sector 04: Moon Basecamp Artemis Survival ] 
                      ↓
[ Sector 05: Martian Bio-Dome & Dust Storm ]
```

---

### Sector 01: Astronaut Profile & Solar Flare Survival (`/level-1`)
* **Objective**: Protect the crew against an incoming class-X Coronal Mass Ejection (CME) solar storm.
* **Key Systems**:
  1. **HERA Dosimeter**: Monitors ambient ionizing cosmic radiation in real-time.
  2. **Crew Ingress Protocol**: Orders astronauts outside on EVA back inside the reinforced habitat bunker.
  3. **Water Wall Shielding**: Activates high-density hydrogen-rich polyethylene water perimeter tanks to absorb ionizing protons.
  4. **Active Electromagnetic Coil Deflection**: Engages magnetic containment shields around the habitat.
* **Survival Mathematics**:
  - *Unprotected*: 18.50 mSv/h (Critical / Lethal).
  - *Partial Defense (2/3 layers)*: 3.10 mSv/h (60% Hazard).
  - *Full Defense (3/3 layers)*: **0.02 mSv/h (100% Protected / Safe)**.
* **Scoring**:
  - Up to **1,000 XP** (500 base XP + 500 bonus XP for 100% protection).
  - Unlocks Grade **S** and the *"Solar Shield Master"* achievement badge.

---

### Sector 02: Proton Rocket Launch Simulation (`/level-2`)
* **Objective**: Launch the heavy-lift Proton-M vehicle, survive Max-Q atmospheric pressure, perform multi-stage separation, and achieve stable Low Earth Orbit (LEO).
* **Physics & Telemetry Controls**:
  - **Orbital Injection Velocity**: Target is exactly **7.80 km/s**.
  - **Orbital Decay Threat**: Accelerating below **7.50 km/s** results in gravitational decay and re-entry burn-up.
  - **Escape Hyper-Trajectory**: Accelerating above **8.20 km/s** escapes Earth's gravity well into an uncontrolled deep space orbit.
  - **Staging Sequences**: Stage 1 booster separation, payload fairing jettison, Stage 2/3 vacuum burn.
* **Scoring**:
  - Up to **1,500 XP** awarded based on star performance:
    - 1 Star (★): 500 XP (Sub-orbital trajectory).
    - 2 Stars (★★): 1,000 XP (Eccentric orbit).
    - 3 Stars (★★★): 1,500 XP (Perfect circularized 7.8 km/s orbit).
  - Unlocks the *"Orbital Velocity"* achievement badge.

---

### Sector 03: Space Station Docking Simulator (`/level-3`)
* **Objective**: Manually dock the crew spacecraft with the International Space Station Harmony Node 2 using 6-Degrees-of-Freedom (6-DoF) Reaction Control Thrusters (RCS).
* **Key Mechanics & Docking Hardware**:
  - **APDS (Androgynous Peripheral Docking System)**: 12 motorized capture latch hooks and a 3-petal guidance ring.
  - **6-DoF Hypergolic RCS Array**: Monomethylhydrazine pulsed thruster pods for translation (+X, -X, +Y, -Y) and attitude alignment.
  - **LIDAR Proximity Guidance**: Real-time laser ranging calculating distance, closing velocity, and angular error.
* **Flight Rules for Safe Capture**:
  1. **Zero-G Inertia**: Thrusting imparts momentum that continues indefinitely in zero-g until counter-thrust is applied.
  2. **Alignment Corridor**: Maintain capsule within the center green crosshairs.
  3. **Velocity Constraint**: Closing velocity must remain **strictly below 2.0 m/s** on contact. High-speed impact damages the station docking collar!
  4. **Structural Latch Engagement**: Once inside the capture envelope, activate the **"ENGAGE STRUCTURAL HARD LATCH"** button.
* **Scoring**:
  - Up to **2,000 XP** (based on soft capture accuracy, fuel conservation, and velocity limits).
  - Unlocks Grade **S** and the *"Ace Pilot"* achievement badge.

---

### Sector 04: Moon Basecamp Artemis Survival (`/level-4`)
* **Objective**: Manage critical resource rationing during the 14-day lunar night at the Moon's South Pole (Shackleton Crater).
* **Survival Challenges**:
  - **14-Day Lunar Night**: Solar panels are non-functional; base operations rely solely on **35% backup lithium batteries**.
  - **Thermal Crisis**: Outside temperature is **-130°C (-200°F)**. Heating set at only 20% will cause crew quarters to freeze. You must divert heating to **80%**.
  - **ECLSS Life Support (Oxygen)**: Maintain air pumps and carbon dioxide (CO₂) scrubbers so astronauts can breathe fresh air.
* **Scoring**:
  - Up to **1,500 XP** for executing nominal resource re-allocation and maintaining base equilibrium.
  - Unlocks the *"Artemis Engineer"* achievement badge.

---

### Sector 05: Martian Bio-Dome & Atmospheric Survival (`/level-5`)
* **Objective**: Defend the Ares colonial bio-dome against an extreme Martian dust and silica sandstorm blowing at 100+ km/h.
* **Survival Protocols**:
  - **Electrostatic Sand Deflector**: Activates high-voltage electrostatic fields to repel abrasive silica grains from scoring glass domes.
  - **Colonial Bio-Dome Scrubbers**: Filters toxic Martian atmospheric gases (95% CO₂) and dust particulate out of greenhouse air supplies.
  - **Automated Emergency Script**: Execute emergency quarantine overrides to safeguard the settlement.
* **Scoring**:
  - Up to **2,000 XP** upon successful crisis execution.
  - Unlocks the *"Martian Pioneer"* achievement badge and completes the campaign!

---

## 4. Game Scoring, XP, Ranks & Achievements

The centralized scoring engine (`msbe/src/lib/score-system.ts`) evaluates mission performance and caches career progress persistently in the browser's `localStorage`.

### 4.1 Career XP & Rank Tiers

Player Level increases by **1 Level for every 500 XP** accumulated:

| Level Tier | Rank Title | Required Total XP |
| :--- | :--- | :--- |
| **Level 1 – 2** | Cadet Explorer | 0 – 999 XP |
| **Level 3 – 5** | Junior Astronaut | 1,000 – 2,499 XP |
| **Level 6 – 9** | Orbital Specialist | 2,500 – 4,499 XP |
| **Level 10 – 14** | Senior Mission Commander | 4,500 – 6,999 XP |
| **Level 15+** | Starfleet Admiral | 7,000+ XP |

### 4.2 Letter Grade Evaluations
At the conclusion of each sector, telemetry is scored against maximum thresholds:
- **Grade S**: 95% – 100% efficiency
- **Grade A**: 80% – 94% efficiency
- **Grade B**: 60% – 79% efficiency
- **Grade C**: Below 60% efficiency

### 4.3 Daily Kepler Exploration Challenges
Every 24 hours, the HUD generates 3 daily planetary objectives:
- **Travel 10 km** (Surface reconnaissance)
- **Scan 5 Creatures** (Exoplanet bio-survey)
- **Collect 20 Resources** (Mineral mining)  
*Completing and claiming daily challenges awards an immediate **+500 XP** bonus directly to your career profile.*

### 4.4 Complete Achievements Roster

| Badge | Achievement Name | Requirement | XP Reward |
| :---: | :--- | :--- | :---: |
| 🛡️ | **Solar Shield Master** | Achieve 100% full radiation protection in Level 1 (0.02 mSv/h) | +350 XP |
| 🚀 | **Orbital Velocity** | Execute flawless Proton staging and hit 7.8 km/s in Level 2 | +500 XP |
| 🛰️ | **Ace Pilot** | Align APDS latches and soft-dock with ISS in Level 3 | +600 XP |
| 🌕 | **Artemis Engineer** | Balance ECLSS and -130°C heating during lunar night in Level 4 | +500 XP |
| 🪐 | **Martian Pioneer** | Deflect severe sandstorms and protect the bio-dome in Level 5 | +750 XP |
| ⭐ | **Daily Explorer** | Complete and claim daily Kepler survey challenges | +250 XP |
| 👑 | **Starfleet Legend** | Accumulate over 5,000 Total Career Mission XP | +1,000 XP |

---

## 5. Starfleet AI Help Desk & Support Chatbot (AURA-9)

To assist flight commanders during planetary campaigns, an interactive AI Help Desk chatbot named **AURA-9** is integrated directly into the simulation.

### Accessing the Help Desk:
1. **Floating Launcher**: Click the glowing **"AI HELP DESK"** pill located at the bottom-right corner of the screen.
2. **Navigation HUD**: Click the robotic assistant icon (**`Bot`**) on the bottom navigation bar.
3. **Keyboard Shortcut**: Press **`ESC`** at any time to close or minimize the Help Desk terminal.

### Help Desk Features & Capabilities:
- **Natural Language Inquiry Engine**: Ask questions in plain English (e.g., *"How do I dock with the station?"*, *"Why is Moon power low?"*, *"What are the Proton rocket launch stages?"*, *"Explain the scoring system"*).
- **Quick-Access Telemetry Pills**: One-click prompt chips for immediate answers to common flight problems.
- **Interactive Action Buttons**: Directly jump to specific level sectors, view your live scoreboard, or open the game manual straight from AI responses.
- **PC Exclusive Advisory**: Reminds explorers of PC platform requirements and control keybindings.
- **Audio Synthesizer Integration**: Features authentic cockpit chime and transmission audio feedback.

---

## 6. Controls & User Interface Guide (PC Exclusive)

Because this is a dedicated PC simulation, the interface takes full advantage of physical desktop peripherals:

* **Mouse Pointer**:
  - Click on interactive cockpit toggles, sliders, and telemetry banks.
  - Click HUD profile emblems to inspect your Explorer Dossier and unlocked achievements.
  - Hover over navigation icons to inspect telemetry tooltips.
* **Keyboard Shortcuts**:
  - **`ESC`**: Closes active modal overlays, help desk terminal, and settings dialogs.
  - **RCS Translation (Level 3)**: Precision impulse buttons for zero-g orbital maneuvering.
* **Audio Engine**:
  - Click the **Mute/Unmute** button in the System Settings modal or Help Desk to toggle procedural sound synthesis.
* **Visual Artwork Modes**:
  - Switch between **Clean 4K Cinematic Artwork** and **Concept Art Reference** via the System Settings menu.

---

## 7. NASA DONKI & OSDR Scientific Integration

*Mission Survival – Beyond Earth* incorporates authentic scientific data streams:
1. **NASA DONKI (Database of Notifications, Knowledge, Information)**:
   - Queries NASA solar weather databases (`/api/donki`) to retrieve real-time Coronal Mass Ejection (CME) telemetry and solar flare activity.
2. **NASA OSDR (Open Science Data Repository)**:
   - Biological radiation dosage limits and spaceflight physiological parameters (ocular pressure, microgravity muscular atrophy, and bone density loss) simulated in Level 1 & Level 3.

---

## 8. Developer Installation & Run Commands

To run or build the game on your local development machine:

```powershell
# Navigate into the msbe application directory
cd "E:\mission game\msbe"

# Install dependencies (Node.js 18+ required)
npm install

# Start development server on http://localhost:3000
npm run dev

# Run production build
npm run build

# Start production server
npm run start
```

---

*Mission Survival – Beyond Earth © Starfleet Deep Space Initiative. Built exclusively for PC Desktop Command Terminals.*
