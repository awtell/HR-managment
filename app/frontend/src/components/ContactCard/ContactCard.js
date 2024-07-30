import React from 'react';
import './ContactCard.css';
import Footer from '../Footer/Footer';

// Import all images dynamically
const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));

const ContactCard = React.forwardRef((props, ref) => {
  const { users, onCardClick, hasMoreUsers, onShowMore, userRole } = props;
  const isSidebarMinimized = false;

  return (
    <section id="tables" className={`contact-card-container ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
      <div className="container">
        <div className="row">
          {users.map((user, index) => (
            <div
              className={`card ${userRole === 'R' ? 'unclickable' : ''}`}
              key={index}
              onClick={() => userRole !== 'R' && onCardClick(user)}
            >
              <img
                src={images[`${user.id}.png`]}
                alt="Profile"
                className="profile-image"
              />
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
