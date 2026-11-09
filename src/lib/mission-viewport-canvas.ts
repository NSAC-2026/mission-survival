/**
 * Canvas FX: Atmospheric Viewport Renderer for Moon & Mars Missions
 * NASA Artemis Basecamp @ Shackleton Crater & Realistic Martian Storm with MAV, Cargo Pods & Rover
 */

export interface StarParticle {
  x: number
  y: number
  size: number
  alpha: number
  phase: number
}

export interface DustParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

export class MissionViewportFX {
  private moonCanvas: HTMLCanvasElement | null
  private marsCanvas: HTMLCanvasElement | null
  private moonCtx: CanvasRenderingContext2D | null
  private marsCtx: CanvasRenderingContext2D | null

  private stars: StarParticle[] = []
  private dustParticles: DustParticle[] = []
  private marsLightning: number = 0
  private time: number = 0
  private animFrameId: number | null = null
  private resizeHandler: () => void

  constructor(
    moonCanvas: HTMLCanvasElement | null,
    marsCanvas: HTMLCanvasElement | null
  ) {
    this.moonCanvas = moonCanvas
    this.marsCanvas = marsCanvas
    this.moonCtx = this.moonCanvas ? this.moonCanvas.getContext('2d') : null
    this.marsCtx = this.marsCanvas ? this.marsCanvas.getContext('2d') : null

    this.resizeHandler = () => this.resize()
    this.init()
  }

  public updateCanvases(
    moonCanvas: HTMLCanvasElement | null,
    marsCanvas: HTMLCanvasElement | null
  ) {
    this.moonCanvas = moonCanvas
    this.marsCanvas = marsCanvas
    this.moonCtx = this.moonCanvas ? this.moonCanvas.getContext('2d') : null
    this.marsCtx = this.marsCanvas ? this.marsCanvas.getContext('2d') : null
    this.resize()
  }

  private init() {
    this.resize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeHandler)
    }
    this.loop()
  }

  public resize() {
    try {
      if (this.moonCanvas) {
        const rect = this.moonCanvas.getBoundingClientRect()
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
        const w =
          rect.width > 20
            ? rect.width
            : this.moonCanvas.parentElement
            ? this.moonCanvas.parentElement.clientWidth
            : 750
        const h =
          rect.height > 20
            ? rect.height
            : this.moonCanvas.parentElement
            ? this.moonCanvas.parentElement.clientHeight
            : 440
        this.moonCanvas.width = Math.max(100, Math.floor(w * dpr))
        this.moonCanvas.height = Math.max(100, Math.floor(h * dpr))
      }
      if (this.marsCanvas) {
        const rect = this.marsCanvas.getBoundingClientRect()
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
        const w =
          rect.width > 20
            ? rect.width
            : this.marsCanvas.parentElement
            ? this.marsCanvas.parentElement.clientWidth
            : 750
        const h =
          rect.height > 20
            ? rect.height
            : this.marsCanvas.parentElement
            ? this.marsCanvas.parentElement.clientHeight
            : 440
        this.marsCanvas.width = Math.max(100, Math.floor(w * dpr))
        this.marsCanvas.height = Math.max(100, Math.floor(h * dpr))
      }
      this.initStars()
      this.initDust()
    } catch (e) {
      console.warn('Canvas resize warn:', e)
    }
  }

  private initStars() {
    this.stars = []
    const count = 120
    const w =
      this.moonCanvas && this.moonCanvas.width > 50
        ? this.moonCanvas.width
        : 800
    const h =
      this.moonCanvas && this.moonCanvas.height > 50
        ? this.moonCanvas.height
        : 500
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.6),
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  private initDust() {
    this.dustParticles = []
    const count = 260
    const w =
      this.marsCanvas && this.marsCanvas.width > 50
        ? this.marsCanvas.width
        : 800
    const h =
      this.marsCanvas && this.marsCanvas.height > 50
        ? this.marsCanvas.height
        : 500
    for (let i = 0; i < count; i++) {
      this.dustParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 5.0 + 3.0,
        vy: (Math.random() - 0.42) * 1.8,
        size: Math.random() * 3.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.25,
        color:
          Math.random() > 0.45 ? 'rgba(255, 110, 30, ' : 'rgba(220, 50, 20, ',
      })
    }
  }

  /* ==========================================================================
     LEVEL 4: NASA ARTEMIS LUNAR BASECAMP @ SHACKLETON CRATER
     ========================================================================== */
  public renderMoon() {
    if (!this.moonCtx || !this.moonCanvas) return
    const ctx = this.moonCtx
    const w = this.moonCanvas.width
    const h = this.moonCanvas.height
    if (w < 30 || h < 30) return

    ctx.clearRect(0, 0, w, h)

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7)
    skyGrad.addColorStop(0, '#010307')
    skyGrad.addColorStop(0.5, '#030812')
    skyGrad.addColorStop(1, '#081220')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, h)

    this.stars.forEach((s) => {
      const flicker = Math.sin(this.time * 2.5 + s.phase) * 0.35 + 0.65
      ctx.fillStyle = `rgba(200, 240, 255, ${s.alpha * flicker})`
      ctx.fillRect(s.x, s.y, s.size, s.size)
    })

    const earthX = w * 0.84
    const earthY = h * 0.17
    const earthR = Math.max(14, Math.min(w, h) * 0.065)
    const earthGrad = ctx.createRadialGradient(
      earthX - earthR * 0.3,
      earthY - earthR * 0.3,
      Math.max(1, earthR * 0.1),
      earthX,
      earthY,
      earthR
    )
    earthGrad.addColorStop(0, '#5fa8e8')
    earthGrad.addColorStop(0.4, '#1b64b8')
    earthGrad.addColorStop(0.85, '#0d2d63')
    earthGrad.addColorStop(1, '#05132d')
    ctx.fillStyle = earthGrad
    ctx.beginPath()
    ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(0, 216, 255, 0.45)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(earthX, earthY, earthR + 1.5, 0, Math.PI * 2)
    ctx.stroke()

    // Shackleton Crater Rim
    ctx.fillStyle = '#060e18'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.52)
    ctx.lineTo(w * 0.15, h * 0.46)
    ctx.lineTo(w * 0.32, h * 0.5)
    ctx.lineTo(w * 0.48, h * 0.42)
    ctx.lineTo(w * 0.65, h * 0.48)
    ctx.lineTo(w * 0.85, h * 0.44)
    ctx.lineTo(w, h * 0.49)
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(0, 216, 255, 0.2)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(0, h * 0.52)
    ctx.lineTo(w * 0.15, h * 0.46)
    ctx.lineTo(w * 0.32, h * 0.5)
    ctx.lineTo(w * 0.48, h * 0.42)
    ctx.lineTo(w * 0.65, h * 0.48)
    ctx.lineTo(w * 0.85, h * 0.44)
    ctx.lineTo(w, h * 0.49)
    ctx.stroke()

    this.drawHLS(ctx, w * 0.82, h * 0.44, Math.max(16, Math.min(w, h) * 0.14))

    const regolithGrad = ctx.createLinearGradient(0, h * 0.5, 0, h)
    regolithGrad.addColorStop(0, '#091522')
    regolithGrad.addColorStop(0.35, '#10202e')
    regolithGrad.addColorStop(1, '#08111a')
    ctx.fillStyle = regolithGrad
    ctx.beginPath()
    ctx.moveTo(0, h * 0.58)
    ctx.bezierCurveTo(
      w * 0.25,
      h * 0.55,
      w * 0.5,
      h * 0.62,
      w * 0.75,
      h * 0.57
    )
    ctx.bezierCurveTo(
      w * 0.88,
      h * 0.54,
      w * 0.95,
      h * 0.59,
      w,
      h * 0.56
    )
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fill()

    const habX = w * 0.46
    const habY = h * 0.6
    const habScale = Math.max(24, Math.min(w, h) * 0.24)
    this.drawArtemisSurfaceHabitat(ctx, habX, habY, habScale)

    const roverX = w * 0.22
    const roverY = h * 0.76
    const roverScale = Math.max(16, Math.min(w, h) * 0.15)
    this.drawNASA_LTV(ctx, roverX, roverY, roverScale)

    this.drawOfflineSolarArray(
      ctx,
      w * 0.68,
      h * 0.58,
      Math.max(12, Math.min(w, h) * 0.12)
    )
  }

  private drawHLS(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
    ctx.save()
    ctx.translate(x, y)
    const width = height * 0.22
    ctx.fillStyle = '#050a12'
    ctx.strokeStyle = 'rgba(0, 216, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-width * 0.5, 0)
    ctx.lineTo(-width * 0.5, -height * 0.75)
    ctx.lineTo(0, -height)
    ctx.lineTo(width * 0.5, -height * 0.75)
    ctx.lineTo(width * 0.5, 0)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = '#0e1d2c'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-width * 0.4, -height * 0.15)
    ctx.lineTo(-width * 0.9, height * 0.12)
    ctx.moveTo(width * 0.4, -height * 0.15)
    ctx.lineTo(width * 0.9, height * 0.12)
    ctx.stroke()

    if (Math.sin(this.time * 3) > 0.1) {
      ctx.fillStyle = '#ff3344'
      ctx.beginPath()
      ctx.arc(0, -height - 2, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  private drawArtemisSurfaceHabitat(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number
  ) {
    ctx.save()
    const groundIllum = ctx.createRadialGradient(
      cx,
      cy,
      r * 0.2,
      cx,
      cy,
      r * 1.5
    )
    groundIllum.addColorStop(0, 'rgba(0, 216, 255, 0.22)')
    groundIllum.addColorStop(0.5, 'rgba(0, 160, 220, 0.08)')
    groundIllum.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = groundIllum
    ctx.beginPath()
    ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#102230'
    ctx.strokeStyle = 'rgba(0, 216, 255, 0.75)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI, 0, false)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = 'rgba(0, 216, 255, 0.35)'
    ctx.lineWidth = 1
    for (let rad = r * 0.3; rad < r; rad += r * 0.32) {
      ctx.beginPath()
      ctx.arc(cx, cy, rad, Math.PI, 0, false)
      ctx.stroke()
    }

    const secX = cx - r * 0.85
    const secR = r * 0.65
    ctx.fillStyle = '#0c1a26'
    ctx.strokeStyle = 'rgba(0, 216, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(secX, cy, secR, Math.PI, 0, false)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    const alX = cx + r * 0.65
    const alW = r * 0.55
    const alH = r * 0.42
    ctx.fillStyle = '#15293a'
    ctx.fillRect(alX, cy - alH, alW, alH)
    ctx.strokeStyle = 'rgba(0, 216, 255, 0.65)'
    ctx.strokeRect(alX, cy - alH, alW, alH)

    ctx.restore()
  }

  private drawNASA_LTV(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = '#1c3447'
    ctx.fillRect(-size * 0.5, -size * 0.28, size * 1.0, size * 0.3)
    ctx.strokeStyle = '#00d8ff'
    ctx.lineWidth = 1.2
    ctx.strokeRect(-size * 0.5, -size * 0.28, size * 1.0, size * 0.3)

    ctx.fillStyle = '#080f16'
    ctx.strokeStyle = 'rgba(0, 216, 255, 0.65)'
    for (let wx = -size * 0.42; wx <= size * 0.45; wx += size * 0.42) {
      ctx.beginPath()
      ctx.arc(wx, size * 0.14, size * 0.15, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    const beamGrad = ctx.createRadialGradient(
      size * 0.5,
      -size * 0.15,
      2,
      size * 2.0,
      size * 0.25,
      size * 1.8
    )
    beamGrad.addColorStop(0, 'rgba(0, 216, 255, 0.75)')
    beamGrad.addColorStop(0.3, 'rgba(0, 216, 255, 0.35)')
    beamGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = beamGrad
    ctx.beginPath()
    ctx.moveTo(size * 0.5, -size * 0.15)
    ctx.lineTo(size * 2.4, size * 0.35)
    ctx.lineTo(size * 1.6, size * 0.75)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  private drawOfflineSolarArray(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -size * 0.7)
    ctx.stroke()

    ctx.fillStyle = '#06131f'
    ctx.strokeStyle = 'rgba(255, 140, 0, 0.6)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-size * 0.6, -size * 0.4)
    ctx.lineTo(0, -size * 0.7)
    ctx.lineTo(size * 0.6, -size * 0.4)
    ctx.lineTo(size * 0.55, -size * 0.2)
    ctx.lineTo(0, -size * 0.55)
    ctx.lineTo(-size * 0.55, -size * 0.2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  /* ==========================================================================
     LEVEL 5: REALISTIC MARTIAN ENVIRONMENT (MAV, CARGO PODS, ROVER, DUST STORM)
     ========================================================================== */
  public renderMars() {
    if (!this.marsCtx || !this.marsCanvas) return
    const ctx = this.marsCtx
    const w = this.marsCanvas.width
    const h = this.marsCanvas.height
    if (w < 30 || h < 30) return

    ctx.clearRect(0, 0, w, h)

    // 1. Violent Turbulent Martian Dust Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
    skyGrad.addColorStop(0, '#1c0704')
    skyGrad.addColorStop(0.35, '#3d1208')
    skyGrad.addColorStop(0.7, '#6b200d')
    skyGrad.addColorStop(1, '#2f0b04')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, h)

    // 2. Churning Dust Vortex / Atmospheric Tornado in background
    const stormX = w * 0.65
    const stormR0 = Math.max(6, w * 0.05)
    const stormR1 = Math.max(30, w * 0.42)
    const stormGrad = ctx.createRadialGradient(
      stormX,
      h * 0.4,
      stormR0,
      stormX,
      h * 0.44,
      stormR1
    )
    stormGrad.addColorStop(0, 'rgba(240, 80, 25, 0.75)')
    stormGrad.addColorStop(0.5, 'rgba(180, 50, 15, 0.5)')
    stormGrad.addColorStop(1, 'rgba(45, 10, 5, 0)')
    ctx.fillStyle = stormGrad
    ctx.beginPath()
    ctx.ellipse(
      stormX,
      h * 0.42,
      Math.max(12, w * 0.32),
      Math.max(20, h * 0.58),
      0.18,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // 3. Martian Sand Dunes (Deep Iron Oxide Red Terrain)
    const duneGrad = ctx.createLinearGradient(0, h * 0.52, 0, h)
    duneGrad.addColorStop(0, '#4a170b')
    duneGrad.addColorStop(0.4, '#631f0d')
    duneGrad.addColorStop(1, '#240803')
    ctx.fillStyle = duneGrad
    ctx.beginPath()
    ctx.moveTo(0, h * 0.56)
    ctx.bezierCurveTo(
      w * 0.22,
      h * 0.51,
      w * 0.46,
      h * 0.63,
      w * 0.7,
      h * 0.55
    )
    ctx.bezierCurveTo(
      w * 0.86,
      h * 0.5,
      w * 0.94,
      h * 0.57,
      w,
      h * 0.53
    )
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fill()

    // 4. Automated Mars Ascent Vehicle (MAV) on Launchpad Gantry
    this.drawMAV(
      ctx,
      w * 0.78,
      h * 0.54,
      Math.max(22, Math.min(w, h) * 0.28)
    )

    // 5. Heavy Cargo Supply Pods (Half-Buried in Red Sand Dunes)
    this.drawBuriedCargoPods(
      ctx,
      w * 0.5,
      h * 0.64,
      Math.max(12, Math.min(w, h) * 0.11)
    )
    this.drawBuriedCargoPods(
      ctx,
      w * 0.58,
      h * 0.67,
      Math.max(10, Math.min(w, h) * 0.09)
    )

    // 6. Robotic Scientific Rover Battling Low-Visibility Storm Density
    this.drawMarsRoboticRover(
      ctx,
      w * 0.26,
      h * 0.74,
      Math.max(16, Math.min(w, h) * 0.17)
    )

    // 7. Dynamic Churning Swirling Red Sand Particles
    this.dustParticles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy + Math.sin(this.time * 3 + p.x * 0.012) * 1.2
      if (p.x > w) p.x = -10
      if (p.y > h) p.y = 0
      if (p.y < 0) p.y = h

      ctx.fillStyle = p.color + p.alpha + ')'
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2)
      ctx.fill()
    })

    // 8. Occasional Atmospheric Electrostatic / Lightning Flash
    if (Math.random() < 0.015) {
      this.marsLightning = 0.28
    }
    if (this.marsLightning > 0) {
      ctx.fillStyle = `rgba(255, 130, 60, ${this.marsLightning})`
      ctx.fillRect(0, 0, w, h)
      this.marsLightning -= 0.04
    }

    // 9. Thick Martian Dust Storm Atmospheric Haze
    const haze = ctx.createLinearGradient(0, 0, w, 0)
    haze.addColorStop(0, 'rgba(200, 60, 20, 0.18)')
    haze.addColorStop(0.5, 'rgba(255, 90, 25, 0.26)')
    haze.addColorStop(1, 'rgba(160, 40, 10, 0.20)')
    ctx.fillStyle = haze
    ctx.fillRect(0, 0, w, h)
  }

  // Mars Ascent Vehicle (MAV) on Launch Pad
  private drawMAV(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.save()
    ctx.translate(x, y)

    const w = size * 0.24
    const h = size * 0.9

    // Launch Gantry Tower Frame
    ctx.strokeStyle = 'rgba(255, 122, 0, 0.6)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(w * 0.7, 0)
    ctx.lineTo(w * 0.7, -h * 0.95)
    ctx.lineTo(w * 1.1, 0)
    ctx.moveTo(w * 0.7, -h * 0.5)
    ctx.lineTo(w * 1.1, -h * 0.5)
    ctx.stroke()

    // MAV Rocket Body
    ctx.fillStyle = '#260c07'
    ctx.strokeStyle = '#ff3b30'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-w * 0.5, 0)
    ctx.lineTo(-w * 0.5, -h * 0.7)
    ctx.lineTo(0, -h) // Aerodynamic nose cone
    ctx.lineTo(w * 0.5, -h * 0.7)
    ctx.lineTo(w * 0.5, 0)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Quad Landing Struts
    ctx.strokeStyle = '#ff7a00'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-w * 0.4, -h * 0.15)
    ctx.lineTo(-w * 0.95, h * 0.12)
    ctx.moveTo(w * 0.4, -h * 0.15)
    ctx.lineTo(w * 0.95, h * 0.12)
    ctx.stroke()

    // Flashing MAV Launch Beacon
    if (Math.sin(this.time * 4) > 0.1) {
      ctx.fillStyle = '#ff2b00'
      ctx.beginPath()
      ctx.arc(0, -h - 2, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  // Heavy Cargo Supply Pods (Half-Buried in Martian Sand Dunes)
  private drawBuriedCargoPods(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    ctx.save()
    ctx.translate(x, y)

    // Cylindrical Cargo Pod Shell
    ctx.fillStyle = '#38130a'
    ctx.strokeStyle = 'rgba(255, 122, 0, 0.7)'
    ctx.lineWidth = 1.2

    ctx.beginPath()
    ctx.ellipse(0, 0, size * 0.8, size * 0.35, -0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Reinforced Pressure Ribs
    ctx.strokeStyle = '#ff7a00'
    ctx.beginPath()
    ctx.arc(-size * 0.3, 0, size * 0.28, Math.PI * 0.5, Math.PI * 1.5)
    ctx.arc(size * 0.2, 0, size * 0.28, Math.PI * 0.5, Math.PI * 1.5)
    ctx.stroke()

    // Half-Buried Sand Dune overlapping the bottom of the pod
    ctx.fillStyle = '#521a0c'
    ctx.beginPath()
    ctx.moveTo(-size * 0.9, size * 0.1)
    ctx.quadraticCurveTo(0, size * 0.4, size * 0.9, size * 0.05)
    ctx.lineTo(size * 0.9, size * 0.4)
    ctx.lineTo(-size * 0.9, size * 0.4)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  // Robotic Scientific Rover Battling Low-Visibility Storm Density
  private drawMarsRoboticRover(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    ctx.save()
    ctx.translate(x, y)

    // Armored Rover Body
    ctx.fillStyle = '#42160e'
    ctx.strokeStyle = '#ff7a00'
    ctx.lineWidth = 1.5
    ctx.fillRect(-size * 0.48, -size * 0.28, size * 0.96, size * 0.32)
    ctx.strokeRect(-size * 0.48, -size * 0.28, size * 0.96, size * 0.32)

    // Scientific Instrument Mast (Mastcam / SuperCam)
    ctx.strokeStyle = '#ffaa00'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(-size * 0.22, -size * 0.28)
    ctx.lineTo(-size * 0.22, -size * 0.65)
    ctx.lineTo(-size * 0.1, -size * 0.65)
    ctx.stroke()

    // Camera Sensor Box
    ctx.fillStyle = '#ff3b30'
    ctx.fillRect(-size * 0.12, -size * 0.72, size * 0.16, size * 0.1)

    // Heavy Rocker-Bogie Traction Wheels
    ctx.fillStyle = '#140603'
    ctx.strokeStyle = '#ff5533'
    for (let wx = -size * 0.38; wx <= size * 0.42; wx += size * 0.38) {
      ctx.beginPath()
      ctx.arc(wx, size * 0.14, size * 0.14, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    // High-Intensity Penetrating Amber Headlight Beam cutting through storm
    const beamGrad = ctx.createRadialGradient(
      size * 0.45,
      -size * 0.12,
      2,
      size * 2.2,
      size * 0.28,
      size * 2.0
    )
    beamGrad.addColorStop(0, 'rgba(255, 170, 0, 0.85)')
    beamGrad.addColorStop(0.35, 'rgba(255, 120, 0, 0.45)')
    beamGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = beamGrad
    ctx.beginPath()
    ctx.moveTo(size * 0.48, -size * 0.12)
    ctx.lineTo(size * 2.5, size * 0.38)
    ctx.lineTo(size * 1.6, size * 0.82)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  private loop() {
    try {
      this.time += 0.02
      if (this.moonCanvas && this.moonCanvas.width > 20) {
        this.renderMoon()
      }
      if (this.marsCanvas && this.marsCanvas.width > 20) {
        this.renderMars()
      }
    } catch (err) {
      console.warn('Canvas render warn:', err)
    }
    this.animFrameId = requestAnimationFrame(() => this.loop())
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler)
    }
  }
}

