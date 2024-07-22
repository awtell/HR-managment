import React, { useEffect, useState, useCallback, useMemo } from 'react';
import NavBar from './Navbar/NavBar';
import ContactCard from './ContactCard/ContactCard';
import Form from './Form/Form';
import { fetchUsers, deleteUser } from '../api';
import './HomePage.css';
import Sidebar from './SideBar/SideBar';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const toggleFormVisibility = useCallback(() => {
    setFormVisible(prev => !prev);
  }, []);

  const handleCardClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const confirmDeleteUser = useCallback((userId) => {
    setUserToDelete(userId);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUser(userToDelete);
      console.log('User deleted successfully:', response);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error, e.g., show an error message to the user
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const extractCompanies = useCallback((users) => {
    const companies = new Set(users.map(user => user.company));
    return [...companies];
  }, []);

  const companies = useMemo(() => extractCompanies(users), [users, extractCompanies]);

  return (
    <>
      <NavBar toggleFormVisibility={toggleFormVisibility} />
      <Sidebar companies={companies} />
      <div className={`homepage-container ${selectedUser ? 'user-selected' : ''}`}>
        <div className="contact-cards">
          <ContactCard users={users} onCardClick={handleCardClick} />
        </div>
        {selectedUser && (
          <div className="user-details">
            <div className="selected-user-details">
              <button className="close-button" onClick={handleCloseDetails}>×</button>
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
                <button className="btn delete" onClick={() => confirmDeleteUser(selectedUser.id)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {formVisible && (
        <div className="overlay">
          <Form formVisible={formVisible} toggleFormVisibility={toggleFormVisibility} />
        </div>
      )}
      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this user?</p>
            <button className="btn btn-yes" onClick={handleConfirmDelete}>Yes</button>
            <button className="btn btn-no" onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;