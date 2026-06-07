import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import { Mail, ArrowUpRight, ExternalLink } from 'lucide-react';
import SpaceScene from './SpaceScene';
import './index.css';

/* ═══ Animated counter ═══ */
function Counter({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══ Letter-by-letter animated heading ═══ */
function SplitText({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="split-char"
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══ Reveal wrapper ═══ */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══ Magnetic button ═══ */
function MagneticBtn({ children, href, className }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════ */

function App() {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = scrollRef.current?.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    { num: '01', title: 'BOF Steelmaking Simulator', desc: 'ML pipeline simulating Basic Oxygen Furnace operations with XGBoost and LSTM for CO₂ optimization.', tags: ['Python', 'XGBoost', 'LSTM'], link: 'https://share.streamlit.io/kushagra1607/bof-deploy/master/app.py' },
    { num: '02', title: 'YouTube Shorts AI Pipeline', desc: 'End-to-end automated system for generating and publishing YouTube Shorts using AI.', tags: ['n8n', 'Gemini API', 'ElevenLabs'] },
    { num: '03', title: 'What To Watch Next', desc: 'Content-based movie recommendation engine using cosine similarity on 5000+ entries.', tags: ['JavaScript', 'HTML/CSS', 'Algorithms'], link: 'https://kushagra1607.github.io/what-to-watch-next/' },
    { num: '04', title: 'College One-Stop Web App', desc: 'Unified college platform — laundry, food, rentals, and library in one interface.', tags: ['Next.js', 'Strapi', 'Tailwind'], link: 'https://campuskart-iit-patna.netlify.app' },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollProgress }}
      />

      {/* 3D Background */}
      <div className="canvas-bg">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <SpaceScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Header */}
      <header className="header">
        <motion.a
          href="#home"
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
        >
          KKS<span className="logo-dot">.</span>
        </motion.a>

        <nav className="nav">
          {['About', 'Projects', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
            >
              <span className="nav-num">0{i + 1}</span>
              {item}
            </motion.a>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <MagneticBtn href="mailto:kartikeykushagra8@gmail.com" className="header-cta">
            Let's talk <ArrowUpRight size={14} />
          </MagneticBtn>
        </motion.div>
      </header>

      {/* Content */}
      <div className="scroll-wrap" ref={scrollRef}>

        {/* ═══ HERO ═══ */}
        <section id="home" className="section hero">
          <div className="hero-inner">
            <motion.div
              className="hero-label"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="hero-label-line" />
              Available for freelance
            </motion.div>

            <h1 className="hero-title">
              <SplitText text="KUSHAGRA" className="hero-title-line" delay={0.3} />
              <SplitText text="KARTIKEY" className="hero-title-line hero-title-outline" delay={0.6} />
              <SplitText text="SUMAN" className="hero-title-line" delay={0.9} />
            </h1>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              B.Tech in Metallurgical & Materials Engineering — IIT Patna<br />
              Building at the intersection of materials science, AI, and web.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <div className="stat">
                <span className="stat-num"><Counter target={4} />+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num"><Counter target={9} />+</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num"><Counter target={1} /></span>
                <span className="stat-label">Research Intern</span>
              </div>
            </motion.div>

            <motion.div
              className="hero-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              onClick={() => scrollTo('about')}
            >
              <span className="scroll-circle">
                <span className="scroll-arrow">↓</span>
              </span>
              <span className="scroll-text">SCROLL</span>
            </motion.div>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="section">
          <div className="container">
            <Reveal>
              <span className="section-label"><span className="label-gold">01</span> — About</span>
            </Reveal>

            <div className="about-grid">
              <Reveal delay={0.1}>
                <div className="img-wrapper">
                  <img src="/profile.jpeg" alt="Kushagra" className="about-img" />
                  <div className="img-border" />
                </div>
              </Reveal>

              <div>
                <Reveal delay={0.2}>
                  <h2 className="about-headline">
                    I build things at the intersection of
                    <span className="text-gold"> materials science</span> and
                    <span className="text-gold"> digital experiences</span>.
                  </h2>
                </Reveal>

                <Reveal delay={0.3}>
                  <p className="body-text">
                    At IIT Patna (2024–2028), I pursue Metallurgical Engineering while crafting
                    software that matters — from ML pipelines to full-stack applications and AI automation.
                  </p>
                </Reveal>

                <Reveal delay={0.4}>
                  <div className="exp-card">
                    <div className="exp-header">
                      <span className="exp-role">Research & Startup Intern — Flash Sintering</span>
                      <span className="exp-date">2025 — Present</span>
                    </div>
                    <span className="exp-place">IIT Patna</span>
                    <ul className="exp-list">
                      <li>Flash sintering of ceramic materials research</li>
                      <li>Rapid densification at low temperatures</li>
                      <li>Commercializing into a startup venture</li>
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.5}>
                  <div className="skills">
                    {['C/C++', 'Python', 'ReactJS/NextJS', 'HTML/CSS/JS', 'Node/Strapi', 'Pandas/Numpy', 'Gemini API', 'Git', 'n8n'].map((s, i) => (
                      <motion.span
                        key={s}
                        className="skill"
                        whileHover={{ scale: 1.08, y: -3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PROJECTS ═══ */}
        <section id="projects" className="section">
          <div className="container">
            <Reveal>
              <span className="section-label"><span className="label-gold">02</span> — Projects</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="section-heading">Selected Work</h2>
            </Reveal>

            <div className="project-list">
              {projects.map((p, i) => {
                const Row = (
                  <motion.div
                    className="project-row"
                    whileHover={{ x: 12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="project-num">{p.num}</span>
                    <div className="project-body">
                      <h3 className="project-title">{p.title}</h3>
                      <p className="project-desc">{p.desc}</p>
                      {p.link && <span className="project-live-badge">Live ↗</span>}
                    </div>
                    <div className="project-tags">
                      {p.tags.map((t) => <span key={t} className="skill skill--sm">{t}</span>)}
                    </div>
                    <ArrowUpRight className="project-arrow" size={22} />
                  </motion.div>
                );
                return (
                  <Reveal key={p.num} delay={i * 0.1}>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer" className="project-link">{Row}</a>
                    ) : Row}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="section section--center">
          <div className="container container--narrow">
            <Reveal>
              <span className="section-label"><span className="label-gold">03</span> — Contact</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="contact-title">
                Got a project?<br />
                <span className="text-gold">Let's talk.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="contact-links">
                <MagneticBtn href="mailto:kartikeykushagra8@gmail.com" className="contact-link">
                  <Mail size={18} />
                  <span>kartikeykushagra8@gmail.com</span>
                  <ArrowUpRight size={14} />
                </MagneticBtn>
                <MagneticBtn href="https://linkedin.com/in/kushagra" className="contact-link">
                  <ExternalLink size={18} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} />
                </MagneticBtn>
                <MagneticBtn href="https://github.com/Kushagra" className="contact-link">
                  <ExternalLink size={18} />
                  <span>GitHub</span>
                  <ArrowUpRight size={14} />
                </MagneticBtn>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <MagneticBtn href="mailto:kartikeykushagra8@gmail.com" className="cta-btn">
                Say Hello <ArrowUpRight size={16} />
              </MagneticBtn>
            </Reveal>

            <div className="footer">
              <span>© 2025 Kushagra Kartikey Suman</span>
              <span>Crafted with React Three Fiber</span>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default App;
