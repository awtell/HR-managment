import React, { useState } from 'react';
import './ContactCard.css';
import im1 from '../../assets/images/logo.jpeg';

const ContactCard = React.forwardRef((props, ref) => {
  const { users, onCardClick } = props;
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <section id='tables' className={`contact-card-container ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
      <div className="container">
        <div className="row">
          {users.map((user, index) => (
            <div className="card" key={index} onClick={() => onCardClick(user)}>
              <img src={im1} alt="Profile" className="profile-image" />
              <div className="card-body">
                <h5 className="card-title">{user.fName} {user.lName}</h5>
                <p className="card-text">{user.company}</p>
              </div>
              <div className="card-footer" style={{ backgroundColor: user.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ContactCard;
