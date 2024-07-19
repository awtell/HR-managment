import { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.jpeg';
import '../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../assets/vendor/boxicons/css/boxicons.min.css';
import '../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../assets/vendor/swiper/swiper-bundle.min.css';
import '../../assets/vendor/bootstrap-icons/bootstrap-icons.css';

const NavBar = ({ toggleFormVisibility }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header id="header" className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : 'transparent-bg'}`}>
        <div className="container d-flex align-items-center">
          <div className="logo me-auto">
            <img src={logo} alt="Lumia Logo" className="img-fluid" />
          </div>
          <nav id="navbar" className={`navbar order-last order-lg-0 ${menuOpen ? 'navbar-mobile' : ''}`}>
            <ul>
              <li><a className="nav-link scrollto" href="#about">About Us</a></li>
              <li><a className="nav-link scrollto active" href="#tables">Our Products</a></li>
              <li><a className="nav-link scrollto" href="#services">Our Services</a></li>
              <li><a className="nav-link scrollto" href="#portfolio">Contact Us</a></li>
              <li><a className="nav-link scrollto" onClick={toggleFormVisibility}>Create Employee</a></li>
            </ul>
            <i className={`bi ${menuOpen ? 'bi-x' : 'bi-list'} mobile-nav-toggle`} onClick={toggleMenu}></i>
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavBar;
