import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroCanvas from '../three/HeroCanvas';
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

const features = [
  { icon: <BoltIcon />, title: 'AI-Powered Extraction', desc: 'Gemini extracts structured fields from your legal documents automatically.' },
  { icon: <FileMultiIcon />, title: 'Multi-Format Support', desc: 'Upload PDF, DOCX, or TXT files — or paste text directly.' },
  { icon: <ShieldCheckIcon />, title: 'Enterprise Security', desc: 'AWS Cognito authentication with encrypted sessions and S3 storage.' },
  { icon: <PrinterIcon />, title: 'LaTeX → PDF Output', desc: 'Professional LaTeX templates compiled to publication-quality PDFs.' },
  { icon: <CpuIcon />, title: '8 Document Types', desc: 'NDA, MOU, contracts, partnerships, collaborations, and more.' },
  { icon: <ServerIcon />, title: 'Cloud-Native', desc: 'Serverless AWS architecture — fast, reliable, scalable.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="hero-badge">AI-Powered Legal Drafting Engine</div>
            <h1>Transform Documents Into<br /><span className="accent-text">Professional Legal Contracts</span></h1>
            <p className="hero-subtitle">
              Upload your legal text. Our AI extracts structured fields, applies professional templates,
              and generates publication-ready PDF contracts in seconds.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn-primary hero-btn">Start Drafting →</Link>
              <a href="#features" className="btn-ghost hero-btn">Learn More</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Built for Legal Professionals
        </motion.h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div key={i} className="feature-card glow-border" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(18,214,197,0.12)' }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="security-section">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="security-card glass">
          <h2>Enterprise-Grade Security</h2>
          <p>Your documents are protected with industry-standard encryption and AWS infrastructure.</p>
          <div className="security-badges">
            <div className="badge"><LockIcon /> Encrypted Sessions</div>
            <div className="badge"><CloudIcon /> AWS Infrastructure</div>
            <div className="badge"><ShieldSmIcon /> Cognito Authentication</div>
            <div className="badge"><BoxIcon /> S3 Secure Storage</div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2>Ready to Draft Your Legal Documents?</h2>
          <p>Upload your documents and let AI generate professional contracts.</p>
          <Link to="/login" className="btn-primary hero-btn">Get Started →</Link>
        </motion.div>
      </section>

      <footer className="landing-footer">
        <p>Legal Doc Drafter — AI-Powered Legal Drafting Platform</p>
      </footer>
    </div>
  );
}
