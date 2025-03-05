import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll('.feature-box').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-section">
      <div className="container h-100">
        <div className="row align-items-center h-100">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="hero-title">Secure Your System</h1>
              <p className="hero-subtitle">
                Detect vulnerabilities and protect your infrastructure with our advanced security scanning tools.
              </p>
              <div className="cta-group">
                <Link to="/scan" className="btn btn-primary btn-lg me-3">
                  <i className="bi bi-shield-check me-2"></i>Start Scanning
                </Link>
                <Link to="/demo" className="btn btn-dark btn-lg">
                  <i className="bi bi-play-circle me-2"></i>Watch Demo
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-dots">
                  <span></span><span></span><span></span>
                </div>
                scan_results.json
              </div>
              <pre className="code-content">
{`{
  "scan_status": "completed",
  "vulnerabilities_found": {
    "critical": 2,
    "high": 3,
    "medium": 5
  },
  "last_scan": "2024-01-20"
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="row features-grid mt-5">
          {[
            {
              icon: 'shield-lock',
              title: 'Vulnerability Detection',
              desc: 'Real-time scanning and detection of security vulnerabilities'
            },
            {
              icon: 'graph-up',
              title: 'Threat Analysis',
              desc: 'Advanced analytics and risk assessment reporting'
            },
            {
              icon: 'clock-history',
              title: 'Continuous Monitoring',
              desc: '24/7 automated security monitoring and alerts'
            }
          ].map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="feature-box" style={{
                '--mouse-x': '0px',
                '--mouse-y': '0px',
              }}>
                <i className={`bi bi-${feature.icon}`}></i>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
