import React from "react";
import "./page.css";

const HomePage = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">SphereCall</h1>
        <p className="subtitle">Connect and chat in real-time with friends and colleagues</p>
      </header>

      <div className="features-grid">
        <div className="feature-card primary">
          <h2 className="feature-title">Join the Conversation</h2>
          <p className="feature-text">Our real-time chat platform makes staying connected easier than ever. Whether for work or play, ChatterBox keeps you in the loop.</p>
          <button className="button-primary">
            Get Started
          </button>
        </div>
        
        <div className="feature-card secondary">
          <h2 className="feature-title">Why Choose ChatterBox?</h2>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="check-mark">✓</span>
              Real-time messaging with no delays
            </li>
            <li className="feature-item">
              <span className="check-mark">✓</span>
              Secure end-to-end encryption
            </li>
            <li className="feature-item">
              <span className="check-mark">✓</span>
              Easy file and media sharing
            </li>
            <li className="feature-item">
              <span className="check-mark">✓</span>
              Mobile and desktop compatible
            </li>
          </ul>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">Ready to start chatting?</h2>
        <p className="cta-text">Create an account or sign in to access your conversations.</p>
        <div className="button-group">
          <button className="button-primary">Sign Up</button>
          <button className="button-secondary">Log In</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
