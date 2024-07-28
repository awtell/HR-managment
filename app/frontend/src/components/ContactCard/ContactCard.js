import React from 'react';
import './ContactCard.css';
import im1 from '../../assets/images/logo.jpeg';
import Footer from '../Footer/Footer';

const ContactCard = React.forwardRef((props, ref) => {
  const { users, onCardClick, hasMoreUsers, onShowMore, userRole } = props;
  const isSidebarMinimized = false;

  return (
    <section id='tables' className={`contact-card-container ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
      <div className="container">
        <div className="row">
          {users.map((user, index) => (
            <div 
              className={`card ${userRole === 'R' ? 'unclickable' : ''}`} 
              key={index} 
              onClick={() => userRole !== 'R' && onCardClick(user)}
            >
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
      {hasMoreUsers && (
        <div className="show-more-button">
          <button className="btn" onClick={onShowMore}>Show More</button>
        </div>
      )}
      <Footer isSidebarMinimized={isSidebarMinimized} />
    </section>
  );
});

export default ContactCard;
