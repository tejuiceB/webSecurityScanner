import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-shield-check me-2"></i>
          SecurityScanner
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className="bi bi-house-door me-1"></i>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/scan"><i className="bi bi-search me-1"></i>Start Scan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about"><i className="bi bi-info-circle me-1"></i>About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact"><i className="bi bi-envelope me-1"></i>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
