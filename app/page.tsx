import Link from 'next/link'

export default function RootPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #07070e;
          --accent: #fb7185;
          --accent2: #7c5ff5;
          --white: #ffffff;
          --muted: rgba(255,255,255,0.4);
          --glass: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.08);
          --glass-hover: rgba(255,255,255,0.07);
        }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--white);
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
        }
        .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.18; }
        .orb-1 { width: 600px; height: 600px; background: var(--accent); top: -200px; left: -100px; }
        .orb-2 { width: 500px; height: 500px; background: var(--accent2); bottom: -100px; right: -100px; }
        .orb-3 { width: 350px; height: 350px; background: var(--accent); top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.07; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem; background: rgba(7,7,14,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.03em; text-decoration: none; color: var(--white); }
        .logo span { color: var(--accent); }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-link { color: var(--muted); text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
        .nav-link:hover { color: var(--white); }
        .nav-cta { background: var(--accent); color: var(--bg); font-weight: 500; font-size: 0.875rem; padding: 0.5rem 1.25rem; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; }
        .nav-cta:hover { opacity: 0.85; }
        .wrap { position: relative; z-index: 1; }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 8rem 1.5rem 4rem; }
        .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(251,113,133,0.08); border: 1px solid rgba(251,113,133,0.2); color: var(--accent); font-size: 0.75rem; font-weight: 500; padding: 0.4rem 1rem; border-radius: 999px; margin-bottom: 2rem; letter-spacing: 0.08em; text-transform: uppercase; backdrop-filter: blur(8px); }
        .hero h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3rem, 9vw, 6.5rem); line-height: 1.0; letter-spacing: -0.04em; max-width: 950px; margin-bottom: 1.5rem; }
        .hero h1 em { font-style: normal; color: var(--accent); }
        .hero p { font-size: clamp(1rem, 2.5vw, 1.2rem); color: var(--muted); max-width: 520px; margin-bottom: 2.5rem; line-height: 1.7; font-weight: 300; }
        .hero-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .btn-primary { background: var(--accent); color: var(--bg); font-weight: 500; font-size: 0.95rem; padding: 0.85rem 2rem; border-radius: 999px; text-decoration: none; transition: transform 0.2s, opacity 0.2s; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-ghost { color: var(--muted); font-size: 0.9rem; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; transition: color 0.2s; padding: 0.85rem 1.5rem; border: 1px solid var(--glass-border); border-radius: 999px; backdrop-filter: blur(8px); background: var(--glass); }
        .btn-ghost:hover { color: var(--white); }
        .hero-note { margin-top: 1.25rem; font-size: 0.78rem; color: var(--muted); }
        .preview { max-width: 860px; margin: 0 auto 6rem; padding: 0 1.5rem; }
        .preview-frame { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; backdrop-filter: blur(20px); box-shadow: 0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06); }
        .preview-bar { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--glass-border); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .dot { width: 9px; height: 9px; border-radius: 50%; }
        .dot-r { background: #ff5f57; }
        .dot-y { background: #febc2e; }
        .dot-g { background: #28c840; }
        .preview-url { flex: 1; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.72rem; color: var(--muted); text-align: center; border: 1px solid var(--glass-border); }
        .preview-content { padding: 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
        .preview-kpi { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1rem 1.25rem; }
        .preview-kpi-val { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; color: var(--accent); line-height: 1; margin-bottom: 0.3rem; }
        .preview-kpi-label { font-size: 0.7rem; color: var(--muted); line-height: 1.3; }
        .preview-kpi-trend { font-size: 0.65rem; color: #4ade80; margin-top: 0.3rem; }
        .section { max-width: 1080px; margin: 0 auto; padding: 5rem 1.5rem; }
        .section-label { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
        .section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.035em; line-height: 1.1; margin-bottom: 1.25rem; max-width: 680px; }
        .section-sub { font-size: 1rem; color: var(--muted); max-width: 520px; line-height: 1.7; margin-bottom: 3.5rem; font-weight: 300; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1px; background: var(--glass-border); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; }
        .feature-card { background: var(--bg); padding: 2rem; transition: background 0.2s; }
        .feature-card:hover { background: var(--glass-hover); }
        .feature-icon { font-size: 1.5rem; margin-bottom: 1rem; display: block; }
        .feature-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .feature-badge { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(124,95,245,0.15); color: #a78bfa; padding: 0.15rem 0.5rem; border-radius: 999px; border: 1px solid rgba(124,95,245,0.2); }
        .feature-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.65; font-weight: 300; }
        .cities-section { padding: 3rem 0; overflow: hidden; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); }
        .cities-label { text-align: center; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.5rem; }
        .cities-track { display: flex; gap: 0.75rem; animation: scroll 25s linear infinite; width: max-content; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .city-pill { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 999px; padding: 0.4rem 1.1rem; font-size: 0.85rem; white-space: nowrap; color: var(--muted); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1px; background: var(--glass-border); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; margin-top: 3rem; }
        .stat-card { background: var(--bg); padding: 2.5rem 1.5rem; text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 3rem; color: var(--accent); line-height: 1; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.8rem; color: var(--muted); font-weight: 300; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; max-width: 640px; margin: 0 auto; }
        .pricing-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 20px; padding: 2rem; backdrop-filter: blur(12px); }
        .pricing-card.featured { border-color: rgba(251,113,133,0.3); background: rgba(251,113,133,0.04); position: relative; }
        .pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent); color: var(--bg); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.3rem 1rem; border-radius: 999px; white-space: nowrap; }
        .pricing-plan { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
        .pricing-price { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 3rem; line-height: 1; margin-bottom: 0.25rem; }
        .pricing-price sup { font-size: 1.2rem; vertical-align: super; }
        .pricing-period { font-size: 0.8rem; color: var(--muted); margin-bottom: 1.75rem; font-weight: 300; }
        .pricing-features { list-style: none; margin-bottom: 2rem; }
        .pricing-features li { font-size: 0.875rem; color: var(--muted); padding: 0.45rem 0; display: flex; align-items: center; gap: 0.6rem; border-bottom: 1px solid var(--glass-border); font-weight: 300; }
        .pricing-features li:last-child { border-bottom: none; }
        .check { color: var(--accent); }
        .pricing-btn { display: block; text-align: center; padding: 0.8rem; border-radius: 999px; font-weight: 500; font-size: 0.9rem; text-decoration: none; transition: opacity 0.2s; }
        .pricing-btn-primary { background: var(--accent); color: var(--bg); }
        .pricing-btn-ghost { background: transparent; color: var(--white); border: 1px solid var(--glass-border); }
        .pricing-btn:hover { opacity: 0.82; }
        .cta-section { text-align: center; padding: 8rem 1.5rem; }
        .cta-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2.5rem, 7vw, 5rem); letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 1.5rem; }
        .cta-title em { font-style: normal; color: var(--accent); }
        .cta-sub { font-size: 1rem; color: var(--muted); margin-bottom: 2.5rem; font-weight: 300; }
        footer { border-top: 1px solid var(--glass-border); padding: 2rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; max-width: 1080px; margin: 0 auto; }
        .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; text-decoration: none; color: var(--white); }
        .footer-logo span { color: var(--accent); }
        .footer-copy { font-size: 0.78rem; color: var(--muted); font-weight: 300; }
        @media (max-width: 768px) {
          nav { padding: 1rem 1.25rem; }
          .nav-links { display: none; }
          .preview-content { grid-template-columns: repeat(2, 1fr); }
          .hero-actions { flex-direction: column; align-items: stretch; text-align: center; }
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <nav>
        <Link href="/" className="logo"><span>Beat</span>Broker</Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <Link href="/login" className="nav-cta">Get started free</Link>
      </nav>

      <div className="wrap">
        <section className="hero">
          <div className="hero-badge">✦ Built for professional DJs</div>
          <h1>Your DJ career,<br /><em>on autopilot</em></h1>
          <p>Manage bookings, negotiate fees, research venues and create content — all powered by AI.</p>
          <div className="hero-actions">
            <Link href="/login" className="btn-primary">Start for free →</Link>
            <a href="#features" className="btn-ghost">See what's inside ↓</a>
          </div>
          <p className="hero-note">No credit card required · Free plan available</p>
        </section>

        <div className="preview">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
              <div className="preview-url">beatbroker.app/dashboard</div>
            </div>
            <div className="preview-content">
              {[
                { val: '12', label: 'Bookings this month', trend: '↑ +3 vs last month' },
                { val: '€3,800', label: 'Monthly revenue', trend: '↑ +18%' },
                { val: '4.9★', label: 'Average rating', trend: '47 reviews' },
                { val: '94%', label: 'Response rate', trend: '↑ Excellent' },
              ].map(k => (
                <div key={k.label} className="preview-kpi">
                  <div className="preview-kpi-val">{k.val}</div>
                  <div className="preview-kpi-label">{k.label}</div>
                  <div className="preview-kpi-trend">{k.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="section" id="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to run your DJ career like a pro</h2>
          <p className="section-sub">From managing your gigs to negotiating with venues. BeatBroker covers every part of the modern DJ business.</p>
          <div className="features-grid">
            {[
              { icon: '📅', title: 'Booking Manager', desc: 'Track all your gigs, fees, promoters and statuses in one clean panel. No more spreadsheets.' },
              { icon: '💰', title: 'Fee Negotiator', badge: 'AI', desc: 'Calculate your fair price based on venue capacity, city and experience. Negotiate with data.' },
              { icon: '🔍', title: 'Venue Research', badge: 'AI', desc: 'Database of 130+ venues across 18 European cities with fees, reputation and contact tips.' },
              { icon: '✦', title: 'Content Generator', badge: 'AI', desc: 'Professional bios, social posts and booking emails generated by AI in seconds.' },
              { icon: '🎯', title: 'Career Plan AI', badge: 'AI', desc: 'Your personalized roadmap to grow as a DJ. Concrete steps based on your level and goals.' },
              { icon: '◎', title: 'AI Assistant 24/7', badge: 'AI', desc: 'Your virtual manager, always on. Answers questions about contracts, riders and strategy.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}{f.badge && <span className="feature-badge">{f.badge}</span>}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="cities-section">
          <div className="cities-label">Venues across Europe</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="cities-track">
              {['Berlin','London','Barcelona','Amsterdam','Paris','Ibiza','Madrid','Lisbon','Milan','Hamburg','Prague','Warsaw','Brussels','Zürich','Valencia','Seville',
                'Berlin','London','Barcelona','Amsterdam','Paris','Ibiza','Madrid','Lisbon','Milan','Hamburg','Prague','Warsaw','Brussels','Zürich','Valencia','Seville'].map((c, i) => (
                <div key={i} className="city-pill">{c}</div>
              ))}
            </div>
          </div>
        </div>

        <section className="section">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label">By the numbers</div>
            <h2 className="section-title" style={{ margin: '0 auto 1rem' }}>Real data for real decisions</h2>
          </div>
          <div className="stats-grid">
            {[
              { n: '130+', l: 'Venues in database' },
              { n: '18', l: 'European cities' },
              { n: '6', l: 'AI-powered tools' },
              { n: '24/7', l: 'AI assistant available' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="stat-num">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="pricing" style={{ textAlign: 'center' }}>
          <div className="section-label">Pricing</div>
          <h2 className="section-title" style={{ margin: '0 auto 1rem' }}>Simple and transparent</h2>
          <p className="section-sub" style={{ margin: '0 auto 3rem' }}>Start free, scale when you're ready.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan">Free</div>
              <div className="pricing-price">€0</div>
              <div className="pricing-period">Forever</div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Booking dashboard</li>
                <li><span className="check">✓</span> Venue research</li>
                <li><span className="check">✓</span> 10 AI uses per month</li>
                <li><span className="check">✓</span> DJ profile</li>
              </ul>
              <Link href="/login" className="pricing-btn pricing-btn-ghost">Get started free</Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Most popular</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price"><sup>€</sup>9</div>
              <div className="pricing-period">per month</div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Everything in Free</li>
                <li><span className="check">✓</span> Unlimited AI</li>
                <li><span className="check">✓</span> Personalized Career Plan</li>
                <li><span className="check">✓</span> Email generator</li>
                <li><span className="check">✓</span> DJ Network</li>
                <li><span className="check">✓</span> Priority support</li>
              </ul>
              <Link href="/login" className="pricing-btn pricing-btn-primary">Start with Pro →</Link>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2 className="cta-title">Ready to take your<br />career <em>to the next level</em>?</h2>
          <p className="cta-sub">Join the DJs already managing their career with intelligence.</p>
          <Link href="/login" className="btn-primary">Create free account →</Link>
        </section>

        <footer>
          <Link href="/" className="footer-logo"><span>Beat</span>Broker</Link>
          <div className="footer-copy">© 2026 BeatBroker. Made for DJs.</div>
        </footer>
      </div>
    </>
  )
}
