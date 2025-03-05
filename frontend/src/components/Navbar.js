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
          <div className="ms-auto nav-auth-buttons d-flex align-items-center">
            <Link to="/signin" className="btn btn-outline-light me-2">
              <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              <i className="bi bi-person-plus me-1"></i>Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
