import { ArrowRight, Phone } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="landing-page">
      <div className="landing-overlay" />
      <div className="landing-vignette" />
      <div className="landing-content">
        <h1 className="landing-title">Visava</h1>
        <p className="landing-subtitle">Sacred Journey, Connected Community</p>
        <div className="landing-divider" />
        <div className="landing-cta" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <button className="start-btn" onClick={onStart}>
            <span>Start Now</span>
            <ArrowRight className="start-btn-arrow" size={18} />
          </button>
          
          <a 
            href="tel:+18633499178"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 115, 0, 0.1)',
              border: '1px solid rgba(255, 115, 0, 0.3)',
              borderRadius: '24px',
              color: 'var(--visava-orange)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Phone size={18} />
            <span>Hindi Helpline: +1 863-349-9178</span>
          </a>
          
          <p className="landing-hint">Begin your pilgrimage experience</p>
        </div>
      </div>
    </div>
  );
}
