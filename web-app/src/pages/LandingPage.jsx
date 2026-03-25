import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroCanvas from '../three/HeroCanvas';
import AnimatedButton from '../components/AnimatedButton';
import { springs } from '../lib/motion';
import './LandingPage.css';

/* ── SVG Feature Icons ── */
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const FileMultiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const PrinterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const CpuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;

/* Security badge icons */
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;
const ShieldSmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;

/* How it Works step icons */
const UploadStepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const SparkleStepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>;
const DownloadStepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>;

const features = [
  { icon: <BoltIcon />, title: 'AI-Powered Extraction', desc: 'Gemini extracts structured fields from your legal documents automatically.' },
  { icon: <FileMultiIcon />, title: 'Multi-Format Support', desc: 'Upload PDF, DOCX, or TXT files — or paste text directly.' },
  { icon: <ShieldCheckIcon />, title: 'Enterprise Security', desc: 'AWS Cognito authentication with encrypted sessions and S3 storage.' },
  { icon: <PrinterIcon />, title: 'LaTeX → PDF Output', desc: 'Professional LaTeX templates compiled to publication-quality PDFs.' },
  { icon: <CpuIcon />, title: '8 Document Types', desc: 'NDA, MOU, contracts, partnerships, collaborations, and more.' },
  { icon: <ServerIcon />, title: 'Cloud-Native', desc: 'Serverless AWS architecture — fast, reliable, scalable.' },
];

const howItWorks = [
  { icon: <UploadStepIcon />, label: '01', title: 'Upload Your Document', desc: 'Drop your legal text as PDF, DOCX, TXT, or paste it directly. Our parser handles any format.' },
  { icon: <SparkleStepIcon />, label: '02', title: 'AI Extraction & Analysis', desc: 'Gemini identifies parties, dates, terms, and clauses — then validates fields with Pydantic schemas.' },
  { icon: <DownloadStepIcon />, label: '03', title: 'Professional PDF Output', desc: 'LaTeX templates produce publication-quality contracts. Download your polished legal documents instantly.' },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Parallax scroll values for hero
  const { scrollYProgress } = useScroll();
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -80]), { stiffness: 100, damping: 30 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  /* ── 3D Reveal Variants ── */
  const card3DReveal = {
    hidden: {
      opacity: 0,
      rotateX: 25,
      y: 60,
      scale: 0.9,
      filter: 'blur(6px)',
    },
    visible: (i = 0) => ({
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        ...springs.smooth,
        delay: i * 0.1,
      },
    }),
  };

  const stepReveal = {
    hidden: {
      opacity: 0,
      rotateY: -15,
      x: -40,
      scale: 0.92,
      filter: 'blur(4px)',
    },
    visible: (i = 0) => ({
      opacity: 1,
      rotateY: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        ...springs.smooth,
        delay: i * 0.15,
      },
    }),
  };

  const badgePop = {
    hidden: { opacity: 0, scale: 0.7, y: 10 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { ...springs.bouncy, delay: i * 0.08 },
    }),
  };

  return (
    <div className="landing">
      {/* Fixed full-page 3D background */}
      <div className="landing-3d-bg">
        <HeroCanvas />
      </div>

      <Navbar />

      {/* ─── Hero ─── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-gradient-overlay" />
        <motion.div
          className="hero-content"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ ...springs.smooth, delay: 0.2 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springs.bouncy, delay: 0.4 }}
            >
              <span className="hero-badge-dot" />
              AI-Powered Legal Drafting Engine
            </motion.div>

            <h1>
              Transform Documents Into<br />
              <span className="accent-text">Professional Legal Contracts</span>
            </h1>

            <p className="hero-subtitle">
              Upload your legal text. Our AI extracts structured fields, applies professional templates,
              and generates publication-ready PDF contracts in seconds.
            </p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.6 }}
            >
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <AnimatedButton variant="primary" className="hero-btn">
                  Start Drafting →
                </AnimatedButton>
              </Link>
              <AnimatedButton
                variant="ghost"
                className="hero-btn"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </AnimatedButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="hero-trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <span className="trust-item"><ShieldSmIcon /> End-to-end encrypted</span>
              <span className="trust-divider" />
              <span className="trust-item"><CloudIcon /> AWS Infrastructure</span>
              <span className="trust-divider" />
              <span className="trust-item"><BoltIcon /> Sub-second processing</span>
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="hero-scroll-indicator">
          <motion.div
            className="scroll-line"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="hiw-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springs.gentle}
          >
            <span className="section-tag">How It Works</span>
            <h2>Three Steps to Professional Documents</h2>
            <p className="section-subtitle">From raw text to polished legal contracts in under a minute</p>
          </motion.div>

          <div className="hiw-grid" style={{ perspective: '800px' }}>
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                className="hiw-step"
                custom={i}
                variants={stepReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{
                  y: -6,
                  rotateY: 3,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(18,214,197,0.08)',
                  borderColor: 'rgba(18, 214, 197, 0.15)',
                  transition: springs.snappy,
                }}
              >
                <div className="hiw-step-number">{step.label}</div>
                <div className="hiw-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < howItWorks.length - 1 && <div className="hiw-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="features-section" ref={featuresRef}>
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springs.gentle}
          >
            <span className="section-tag">Features</span>
            <h2>Built for Legal Professionals</h2>
            <p className="section-subtitle">Enterprise-grade tools designed for precision and efficiency</p>
          </motion.div>

          <div className="features-grid" style={{ perspective: '1000px' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card-wrap"
                custom={i}
                variants={card3DReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{
                  y: -8,
                  rotateX: -2,
                  scale: 1.03,
                  boxShadow: '0 16px 50px rgba(0,0,0,0.4), 0 0 30px rgba(18,214,197,0.1)',
                  transition: springs.snappy,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="feature-card-glow" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section className="security-section">
        <div className="section-container">
          <motion.div
            className="security-card"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={springs.smooth}
          >
            <span className="section-tag">Security</span>
            <h2>Enterprise-Grade Security</h2>
            <p>Your documents are protected with industry-standard encryption and AWS infrastructure.</p>
            <div className="security-badges">
              {[
                { icon: <LockIcon />, text: 'Encrypted Sessions' },
                { icon: <CloudIcon />, text: 'AWS Infrastructure' },
                { icon: <ShieldSmIcon />, text: 'Cognito Authentication' },
                { icon: <BoxIcon />, text: 'S3 Secure Storage' },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className="badge"
                  custom={i}
                  variants={badgePop}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.05, transition: springs.snappy }}
                >
                  {b.icon} {b.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={springs.smooth}
          >
            <h2>Ready to Draft Your Legal Documents?</h2>
            <p>Upload your documents and let AI generate professional contracts.</p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="primary" className="hero-btn">
                Get Started →
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="footer-gradient" />
        <p>Legal Doc Drafter — AI-Powered Legal Drafting Platform</p>
      </footer>
    </div>
  );
}
