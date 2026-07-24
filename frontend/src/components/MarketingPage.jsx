import React, { useState } from 'react';
import '../marketing.css';
import {
  Lightning3D,
  Shield3D,
  Compass3D,
  Chart3D,
  Truck3D,
  Clipboard3D,
  Map3D,
  Robot3D,
  Brain3D,
  Lock3D,
  Collaboration3D,
  Building3D,
  Bell3D,
  Clock3D,
  Envelope3D
} from './Icon3D';

export default function MarketingPage({ currentPath, navigate, isAuthenticated }) {
  // Who It's For persona switcher state
  const [activePersona, setActivePersona] = useState('Safety Managers');

  // Contact form submission state
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
  };

  const handleResetForm = () => {
    setContactSuccess(false);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  // Persona details copy mapping
  const personas = {
    'Safety Managers': {
      title: 'Maintain Bulletproof Fleet Compliance',
      desc: 'Verify driving shift boundaries, consecutive off-duty limits, and cycle recap margins instantly. Audit automated 34h restarts and fuel stops to prevent DOT audit violations before they occur.',
      tag: 'Audit Control',
      icon: <Shield3D size={20} />
    },
    'Dispatchers': {
      title: 'Plan Optimized Route Dispatch Legs',
      desc: 'Schedule deadheads, loaded legs, and fueling pauses with live maps integration. Seamlessly budget driver shift clocks to accurately predict cargo arrival times at target dropoffs.',
      tag: 'Logistics Control',
      icon: <Compass3D size={20} />
    },
    'Fleet Directors': {
      title: 'Unlock Total Workspace Scalability',
      desc: 'Connect all drivers into a single dispatch terminal. Monitor total planned miles, active logs, compliance rates, and aggregate fuel logs in one comprehensive dashboard.',
      tag: 'Scale Control',
      icon: <Chart3D size={20} />
    },
    'Owner-Operators': {
      title: 'Maximize Driving Clocks Profitably',
      desc: 'Quickly plan trip schedules and view daily log previews right from your cabin. Run simulations to keep your consecutive driving logs clean and audit-ready.',
      tag: 'Operator Control',
      icon: <Truck3D size={20} />
    },
    'Safety Auditors': {
      title: 'Accelerate Inspections & Logs Reviews',
      desc: 'Review clean, FMCSA-standard daily log sheet grids on demand. Spot shift clock violations or missing consecutive rest breaks immediately with clear warning labels.',
      tag: 'Verification Control',
      icon: <Clipboard3D size={20} />
    }
  };

  return (
    <div className="marketing-body">
      
      {/* 1. Sticky Navigation Bar */}
      <nav className="m-navbar">
        <div className="m-nav-container">
          <div className="m-logo" onClick={() => navigate('/')}>
            <Lightning3D size={18} />
            <span>HOS Planner</span>
          </div>
          <ul className="m-nav-links">
            <li>
              <span className={`m-nav-link ${currentPath === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
                Home
              </span>
            </li>
            <li>
              <span className="m-nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Features
              </span>
            </li>
            <li>
              <span className="m-nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Solutions
              </span>
            </li>
            <li>
              <span className="m-nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                About
              </span>
            </li>
            <li>
              <span className="m-nav-link" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Contact
              </span>
            </li>
          </ul>

          <div className="m-nav-actions">
            {isAuthenticated ? (
              <button className="m-btn-cta" onClick={() => navigate('/app')}>
                Go to Dashboard ➔
              </button>
            ) : (
              <>
                <button className="m-btn-login" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="m-btn-cta" onClick={() => navigate('/login')}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Frames */}
      <div className="m-content">

        {/* 2. Hero Section */}
        <header className="m-section">
          <div className="m-hero-grid">
            <div className="m-hero-left">
              <div className="m-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Lightning3D size={14} className="icon-float" /> Build AI-powered compliance logistics in minutes
              </div>
              <h1>Simplify FMCSA Compliance. <br />Plan and Audit HOS Logs in Minutes.</h1>
              <p>
                Auto-calculate property-carrying driver limitations, deadhead miles, consecutive rest windows, and draw compliant Daily Log grids instantly on a modern dashboard.
              </p>
              <div className="m-hero-actions">
                <button className="m-btn-cta" onClick={() => navigate('/login')}>Start Free</button>
                <button className="m-btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Watch Demo</button>
              </div>
            </div>
            
            <div className="m-hero-right">
              {/* Floating UI mockups matching clerk/linear cards */}
              <div className="m-floating-card" style={{ transform: 'rotate(-1deg)' }}>
                <div className="m-floating-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Map3D size={16} /> Interactive Planner
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span>Chicago, IL ➜ Dallas, TX</span>
                  <span style={{ color: 'var(--m-accent)', fontWeight: 'bold' }}>821 mi</span>
                </div>
              </div>

              <div className="m-floating-card" style={{ marginLeft: '40px', transform: 'rotate(1deg)' }}>
                <div className="m-floating-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Robot3D size={16} /> AI Assistant
                </div>
                <p style={{ fontSize: '12px', margin: 0, color: 'var(--m-text-main)' }}>
                  "Driver is entering 34h restart break at Stop 3 (Dallas Pilot Fuel Stop)."
                </p>
              </div>

              <div className="m-floating-card" style={{ transform: 'rotate(-0.5deg)' }}>
                <div className="m-floating-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Chart3D size={16} /> Analytics Reports
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--m-text-muted)', display: 'block' }}>COMPLIANCE</span>
                    <strong style={{ fontSize: '16px', color: '#10b981' }}>100%</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--m-text-muted)', display: 'block' }}>CYCLE SAVED</span>
                    <strong style={{ fontSize: '16px' }}>18.5h Left</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Benefits Section */}
        <section className="m-section">
          <div className="m-benefits-grid">
            <div className="m-benefit-card">
              <div className="m-benefit-icon">
                <Brain3D size={28} />
              </div>
              <h3>AI Powered HOS Router</h3>
              <p>Simulates consecutive shift timelines and automatically overlays mandatory rest intervals and fueling stop limits.</p>
            </div>
            
            <div className="m-benefit-card">
              <div className="m-benefit-icon">
                <Chart3D size={28} />
              </div>
              <h3>Real-Time Analytics</h3>
              <p>Instantly calculates drive hours, cumulative duty periods, and outputs automated recap audit balance logs.</p>
            </div>

            <div className="m-benefit-card">
              <div className="m-benefit-icon">
                <Lock3D size={28} />
              </div>
              <h3>Secure &amp; Reliable</h3>
              <p>Driver sessions and planned route records are securely synced in our high-availability database console.</p>
            </div>

            <div className="m-benefit-card">
              <div className="m-benefit-icon">
                <Collaboration3D size={28} />
              </div>
              <h3>Easy Collaboration</h3>
              <p>Export digital Daily Log mockups and route spreadsheets to safety dispatch desks or inspect stations in one click.</p>
            </div>
          </div>
        </section>

        {/* 4. Features Showcase */}
        <section className="m-section" id="features">
          <div className="m-showcase-header">
            <h2>Platform Capabilities</h2>
            <p>Everything owner-operators and logistics dispatch desks need to ensure safety compliance during long-haul deadhead runs.</p>
          </div>
          
          <div className="m-showcase-grid">
            <div className="m-showcase-card">
              <Robot3D size={36} style={{ marginBottom: '16px' }} />
              <h3>AI Compliance Assistant</h3>
              <p>Get real-time feedback on HOS rules shifts, consecutive off-duty exceptions, and 34-hour reset validations via chatbot.</p>
            </div>

            <div className="m-showcase-card">
              <Compass3D size={36} style={{ marginBottom: '16px' }} />
              <h3>Intelligent Route Maps</h3>
              <p>Renders accurate deadhead paths, loaded routes, rest stop overlays, and live coordinates via Leaflet OSM.</p>
            </div>

            <div className="m-showcase-card">
              <Clipboard3D size={36} style={{ marginBottom: '16px' }} />
              <h3>Standard Log Sheets</h3>
              <p>Visualizes standard property-carrying grid sheets (Off Duty, Sleeper Berth, Driving, On Duty) matching paper logs.</p>
            </div>

            <div className="m-showcase-card">
              <Building3D size={36} style={{ marginBottom: '16px' }} />
              <h3>Workspace Management</h3>
              <p>Organize trip schedules, select active driver terminals, and customize cycle regulations easily.</p>
            </div>

            <div className="m-showcase-card">
              <Bell3D size={36} style={{ marginBottom: '16px' }} />
              <h3>Safety Alerts</h3>
              <p>Receive notifications for exceeding consecutive drive hours, shift limits, or weekly cycle caps.</p>
            </div>

            <div className="m-showcase-card">
              <Clock3D size={36} style={{ marginBottom: '16px' }} />
              <h3>Saved Trips History</h3>
              <p>Save planned routes and audit timelines securely to your profile and reload them back to the map in a single click.</p>
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="m-section">
          <div className="m-showcase-header">
            <h2>Process Workflows</h2>
            <p>Calculate optimal driving plans and export logs in four simple steps.</p>
          </div>

          <div className="m-steps-container">
            <div className="m-step-node">
              <div className="m-step-number">1</div>
              <h4>Create Account</h4>
              <p>Sign up in seconds to start planning compliant routing schedules.</p>
            </div>
            
            <div className="m-step-node">
              <div className="m-step-number">2</div>
              <h4>Upload Route Parameters</h4>
              <p>Type start terminals, deadhead legs, and your current cycle clocks.</p>
            </div>

            <div className="m-step-node">
              <div className="m-step-number">3</div>
              <h4>AI Engine Calculation</h4>
              <p>Our solver maps the route and automatically plans compliant rests.</p>
            </div>

            <div className="m-step-node">
              <div className="m-step-number">4</div>
              <h4>View Logs &amp; Drive</h4>
              <p>Review standard daily log sheets and export driving itineraries.</p>
            </div>
          </div>
        </section>

        {/* 6. Who It's For */}
        <section className="m-section" id="solutions">
          <div className="m-showcase-header">
            <h2>Tailored for Industry Personas</h2>
            <p>Learn how our compliance solutions help safety and dispatcher operations reach optimal output.</p>
          </div>

          <div className="m-who-split">
            <ul className="m-who-list">
              {Object.keys(personas).map((persona) => (
                <li
                  key={persona}
                  className={`m-who-item ${activePersona === persona ? 'active' : ''}`}
                  onClick={() => setActivePersona(persona)}
                >
                  {personas[persona].icon} {persona}
                </li>
              ))}
            </ul>

            <div className="m-who-details">
              <div className="m-who-preview-info">
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--m-accent)', background: 'var(--m-accent-light)', padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase' }}>
                  {personas[activePersona].tag}
                </span>
                <h3 style={{ marginTop: '16px' }}>{personas[activePersona].title}</h3>
                <p>{personas[activePersona].desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="m-section">
          <div className="m-showcase-header">
            <h2>Trusted by Safety Personnel</h2>
            <p>Read opinions and reviews from commercial transportation and compliance operators.</p>
          </div>

          <div className="m-testimonials-grid">
            <div className="m-testimonial-card">
              <div className="m-testimonial-rating">★★★★★</div>
              <p className="m-testimonial-quote">
                "We dropped shift limit compliance violations to zero within the first month. The route stop planning visualizer makes dispatching simple."
              </p>
              <div className="m-testimonial-user">
                <div className="m-testimonial-avatar">JD</div>
                <div className="m-testimonial-meta">
                  <h5>James Davidson</h5>
                  <span>Safety Manager, Apex Transit</span>
                </div>
              </div>
            </div>

            <div className="m-testimonial-card">
              <div className="m-testimonial-rating">★★★★★</div>
              <p className="m-testimonial-quote">
                "Calculating consecutive rest stops and 34h restarts was a huge dispatch bottleneck. HOS Planner automates the calculations in milliseconds."
              </p>
              <div className="m-testimonial-user">
                <div className="m-testimonial-avatar">SR</div>
                <div className="m-testimonial-meta">
                  <h5>Sarah Reynolds</h5>
                  <span>Dispatch Director, LogiLink Express</span>
                </div>
              </div>
            </div>

            <div className="m-testimonial-card">
              <div className="m-testimonial-rating">★★★★★</div>
              <p className="m-testimonial-quote">
                "As an owner-operator, budgeting weekly cycle recap limits can be stressful. The log grid visualizer lets me check sheets prior to hauling."
              </p>
              <div className="m-testimonial-user">
                <div className="m-testimonial-avatar">BM</div>
                <div className="m-testimonial-meta">
                  <h5>Bill Miller</h5>
                  <span>Owner-Operator, Miller Hauling</span>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* 9. FAQ Accordion */}
        <section className="m-section">
          <div className="m-showcase-header">
            <h2>Frequently Asked Questions</h2>
            <p>Review responses to common logistics calculations questions.</p>
          </div>

          <div className="m-faq-list">
            <details className="m-faq-accordion">
              <summary>How does the AI router process rest requirements?</summary>
              <div className="m-faq-body">
                Our calculation solver monitors cumulative driving shifts and consecutive duty limits. When the system detects the driver approaching their limits, it automatically inserts a mandatory rest stop at the nearest available coordinate.
              </div>
            </details>

            <details className="m-faq-accordion">
              <summary>Does this replace ELD hardware loggers?</summary>
              <div className="m-faq-body">
                No, this planner serves as a pre-trip route builder and logistics calculator rather than a live ELD tracker. It outputs compliant log mockups to prevent violations.
              </div>
            </details>

            <details className="m-faq-accordion">
              <summary>Are international routing limits supported?</summary>
              <div className="m-faq-body">
                We currently support FMCSA §395 regulations for US property-carrying commercial drivers, including cycle clocks (70h/8d limit) and shift restart limits.
              </div>
            </details>
          </div>
        </section>

        {/* 10. Contact Us */}
        <section className="m-section" id="contact">
          <div className="m-showcase-header">
            <h2>Get in Touch</h2>
            <p>Have questions about compliance rules or fleet audits? Send us a message.</p>
          </div>

          <div className="m-contact-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="m-contact-card" style={{ background: 'var(--m-bg-surface)', border: '1px solid var(--m-border)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--m-shadow-xl)' }}>
              {contactSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Envelope3D size={48} style={{ marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Thank you, {contactName}!</h4>
                  <p style={{ color: 'var(--m-text-muted)', fontSize: '14px' }}>Your message has been sent. Our safety compliance desk will get back to you shortly.</p>
                  <button className="m-btn-secondary" style={{ marginTop: '20px' }} onClick={handleResetForm}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--m-text-main)' }}>Your Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="driver_bob"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--m-text-main)' }}>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="bob@example.com"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--m-text-main)' }}>Your Message</label>
                    <textarea 
                      className="form-input" 
                      rows="4"
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Write your compliance question or feedback here..."
                      style={{ resize: 'vertical', fontFamily: 'inherit', padding: '12px' }}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="m-btn-cta" style={{ width: '100%' }}>
                    Send Message ➔
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 11. Call-To-Action Banner */}
        <section className="m-section">
          <div className="m-cta-banner">
            <h2>Ready to Eliminate Compliance Risk?</h2>
            <p>Sign up now to plan routes, budget shifts, and keep your driver log history fully organized.</p>
            <button className="m-btn-cta" style={{ background: '#ffffff', color: '#09090b', border: '1px solid #ffffff' }} onClick={() => navigate('/login')}>
              Get Started for Free
            </button>
          </div>
        </section>

      </div>

      {/* 11. Footer Section */}
      <footer className="m-section" id="about" style={{ paddingBottom: '32px' }}>
        <div className="m-footer-grid">
          <div className="m-footer-brand">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lightning3D size={18} /> HOS Planner</h4>
            <p>Modern compliance logistics calculators built to simplify commercial trucking rules.</p>
            <div className="m-footer-socials">
              <span className="m-social-icon">𝕏</span>
              <span className="m-social-icon">in</span>
              <span className="m-social-icon">GitHub</span>
            </div>
          </div>
          
          <div className="m-footer-col">
            <h5>Company</h5>
            <ul className="m-footer-links">
              <li><span className="m-footer-link" onClick={() => navigate('/')}>Home</span></li>
              <li><span className="m-footer-link" onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}>Features</span></li>
            </ul>
          </div>

          <div className="m-footer-col">
            <h5>Resources</h5>
            <ul className="m-footer-links">
              <li><span className="m-footer-link">Documentation</span></li>
              <li><span className="m-footer-link">Blog</span></li>
              <li><span className="m-footer-link">API Keys</span></li>
            </ul>
          </div>

          <div className="m-footer-col" id="contact">
            <h5>Legal</h5>
            <ul className="m-footer-links">
              <li><span className="m-footer-link">Privacy Policy</span></li>
              <li><span className="m-footer-link">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="m-footer-bottom">
          <p className="m-footer-copyright">
            © {new Date().getFullYear()} HOS Planner, Inc. All rights reserved. FMCSA compliance console.
          </p>
        </div>
      </footer>

    </div>
  );
}
