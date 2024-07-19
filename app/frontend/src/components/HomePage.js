import React, { useEffect, useState } from 'react';
import NavBar from './Navbar/NavBar';
import ContactCard from './ContactCard/ContactCard';
import Form from './Form/Form';
import { fetchUsers } from '../api';
import './HomePage.css';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <NavBar toggleFormVisibility={toggleFormVisibility} />
      <div className={`homepage-container ${selectedUser ? 'user-selected' : ''}`}>
        <div className="contact-cards">
          <ContactCard users={users} onCardClick={handleCardClick} />
        </div>
        {selectedUser && (
          <div className="user-details">
            <div className="selected-user-details">
              <h2>{selectedUser.fName} {selectedUser.lName}</h2>
              <p>Address: {selectedUser.address}</p>
              <p>Company: {selectedUser.company}</p>
              <p>City: {selectedUser.city}</p>
              <p>Country: {selectedUser.country}</p>
              <p>Phone: {selectedUser.phone}</p>
              <div className="user-actions">
                <button className="btn">Share</button>
                <button className="btn">Send</button>
                <button className="btn">Call</button>
                <button className="btn delete">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {formVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <Form formVisible={formVisible} toggleFormVisibility={toggleFormVisibility} />
        </div>
      )}
    </>
  );
}

export default HomePage;