import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-links">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-github"></i>
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-twitter"></i>
        </a>
        <span className="separator">|</span>
        <small>Made with ❤️ by Tejuice</small>
      </div>
    </footer>
  );
};

export default Footer;
