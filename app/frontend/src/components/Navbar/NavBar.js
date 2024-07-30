import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.jpeg';
import '../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../assets/vendor/boxicons/css/boxicons.min.css';
import '../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../assets/vendor/swiper/swiper-bundle.min.css';
import '../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import { fetchCurrentUser } from '../../api';

// Import all images dynamically
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));

const NavBar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const currentUser = await fetchCurrentUser(token);
          setUser(currentUser);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
    };
    getCurrentUser();
  }, []);

  return (
    <header id="header" className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : 'transparent-bg'}`}>
      <div className="container d-flex align-items-center justify-content-between">
        <div className="logo me-auto">
          <img src={logo} alt="Lumia Logo" className="img-fluid" />
        </div>
        <nav id="navbar" className={`navbar order-last order-lg-0 ${menuOpen ? 'navbar-mobile' : ''}`}>
          <ul>
            <li><a className="nav-link scrollto" href="#about">About Us</a></li>
            <li><a className="nav-link scrollto active" href="#tables">Our Products</a></li>
            <li><a className="nav-link scrollto" href="#services">Our Services</a></li>
            <li><a className="nav-link scrollto" href="#portfolio">Contact Us</a></li>
            <li><button className="btn logout" onClick={onLogout}>Logout</button></li>
          </ul>
          <i className={`bi ${menuOpen ? 'bi-x' : 'bi-list'} mobile-nav-toggle`} onClick={toggleMenu}></i>
        </nav>
        {user && (
          <div className="user-info">
            <span className="user-name">{user.fName} {user.lName}</span>
            <img src={images[`${user.id}.png`]} alt="Profile" className="profile-image" />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
