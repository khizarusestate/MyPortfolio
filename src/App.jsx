import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Volume2, VolumeX } from 'lucide-react'
import CharacterStage from './components/CharacterStage.jsx'

const navItems = ['About', 'Experience', 'Projects', 'Contact']

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [introPhase, setIntroPhase] = useState('black')

  useEffect(() => {
    const reveal = window.setTimeout(() => setIntroPhase('reveal'), 1000)
    const exit = window.setTimeout(() => setIntroPhase('exit'), 2900)
    const finish = window.setTimeout(() => setIntroPhase('done'), 3700)
    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(exit)
      window.clearTimeout(finish)
    }
  }, [])

  const playUiSound = () => {
    if (!soundEnabled) return
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(720, context.currentTime)
      gain.gain.setValueAtTime(0.045, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.055)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.06)
      oscillator.onended = () => context.close()
    } catch {
      // Audio is an optional enhancement; the interface remains fully usable.
    }
  }

  return (
    <>
      {introPhase !== 'done' && (
        <div className={`welcome-intro ${introPhase}`} aria-label="Welcome">
          <div className="welcome-copy">
            <p>WELCOME</p>
            <span>KHIZAR HAYAT</span>
          </div>
        </div>
      )}
      <main>
        <header className="site-header">
          <a className="wordmark" href="#home" onClick={playUiSound}>KH<span>.</span></a>
          <nav aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={playUiSound}>{item}</a>
            ))}
          </nav>
          <button className="sound-toggle" onClick={() => setSoundEnabled((value) => !value)} aria-label={soundEnabled ? 'Disable interface sounds' : 'Enable interface sounds'}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Sound {soundEnabled ? 'on' : 'off'}</span>
          </button>
        </header>

        <section className="hero" id="home">
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>SOFTWARE ENGINEER · GUJRANWALA, PK</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Building digital<br /><span>experiences.</span>
            </motion.h1>
            <p className="hero-description">I’m Khizar — a developer focused on thoughtful interfaces, useful products and reliable web experiences.</p>
            <a className="text-link" href="#projects" onClick={playUiSound}>Explore my work <ArrowUpRight size={16} /></a>
          </div>
          <CharacterStage onInteract={playUiSound} />
          <div className="hero-index"><span>01</span><span> / INTRODUCTION</span></div>
          <a className="scroll-cue" href="#about"><ArrowDown size={15} /> SCROLL TO EXPLORE</a>
        </section>

        <section className="content-section about-section" id="about">
          <p className="eyebrow">01 / ABOUT</p>
          <h2>Curious by nature.<br /><span>Builder by choice.</span></h2>
          <p className="section-copy">A little more about my journey, the tools I use and the problems I enjoy solving. This section will be filled with verified personal details as we shape the portfolio.</p>
        </section>

        <section className="content-section" id="experience">
          <p className="eyebrow">02 / EXPERIENCE</p>
          <h2>Where I’ve been<br /><span>and what I’ve learned.</span></h2>
          <p className="section-copy">Experience timeline placeholder — we’ll add roles, freelance work and measurable outcomes next.</p>
        </section>

        <section className="content-section" id="projects">
          <p className="eyebrow">03 / SELECTED WORK</p>
          <h2>Things I’ve<br /><span>made useful.</span></h2>
          <div className="project-placeholder">Project case studies will appear here.</div>
        </section>

        <footer className="content-section footer-section" id="contact">
          <p className="eyebrow">04 / CONTACT</p>
          <h2>Have something<br /><span>in mind?</span></h2>
          <a className="text-link" href="mailto:hello@example.com">Let’s talk <Mail size={16} /></a>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Khizar Hayat</span><span>Designed & built with intention.</span><span><Github size={15} /><Linkedin size={15} /></span></div>
        </footer>
      </main>
    </>
  )
}
