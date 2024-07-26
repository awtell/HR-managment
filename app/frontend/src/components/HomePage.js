import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ContactCard from './ContactCard/ContactCard';
import Form from './Form/Form';
import { fetchUsers, postUser, deleteUser, updateUser } from '../api';
import './HomePage.css';
import Sidebar from './SideBar/SideBar';
import NavBar from './Navbar/NavBar';

const HomePage = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    address: '',
    company: '',
    city: '',
    country: '',
    phone: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers(9, token)
      .then(data => {
        setUsers(data);
        setVisibleUsers(data.slice(0, 9));
        setHasMoreUsers(data.length > 9);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [token]);

  useEffect(() => {
    if (showMore) {
      fetchUsers(visibleUsers.length + 6, token)
        .then(data => {
          if (data.length <= visibleUsers.length) {
            setHasMoreUsers(false);
          } else {
            setUsers(data);
            setVisibleUsers(data.slice(0, visibleUsers.length + 6));
          }
        })
        .catch(error => console.error('Error fetching users:', error))
        .finally(() => setShowMore(false));
    }
  }, [showMore, visibleUsers.length, token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFormVisibility = useCallback(() => {
    setFormVisible(prev => !prev);
  }, []);

  const handleCardClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedUser(null);
    setIsEditing(false);
  }, []);

  const confirmDeleteUser = useCallback((userId) => {
    setUserToDelete(userId);
    setShowConfirmModal(true);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete, token);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      setVisibleUsers(prevVisibleUsers => prevVisibleUsers.filter(user => user.id !== userToDelete));
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const handleCompanyClick = (company) => {
    setSelectedCompanies(prevCompanies => {
      if (prevCompanies.includes(company)) {
        return prevCompanies.filter(c => c !== company);
      } else {
        return [...prevCompanies, company];
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return selectedCompanies.length > 0
      ? users.filter(user => selectedCompanies.includes(user.company))
      : visibleUsers;
  }, [selectedCompanies, users, visibleUsers]);

  const handleEdit = () => {
    setFormData(selectedUser);
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...selectedUser, ...formData };
      await updateUser(selectedUser.id, updatedUser, token);
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
      setVisibleUsers((prevVisibleUsers) => prevVisibleUsers.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
      setSelectedUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarMinimized(prev => !prev);
  };

  return (
    <>
      <NavBar onLogout={onLogout} />
      <Sidebar
        companies={companies}
        onCompanyClick={handleCompanyClick}
        selectedCompanies={selectedCompanies}
        toggleFormVisibility={toggleFormVisibility}
        toggleSidebar={toggleSidebar}
        sidebarMinimized={sidebarMinimized}
      />
      <div className={`homepage-container ${sidebarMinimized ? 'sidebar-minimized' : 'sidebar-expanded'}`}>
        <div className="contact-cards">
          <ContactCard users={filteredUsers} onCardClick={handleCardClick} />
          {hasMoreUsers && (
            <div className="show-more-button">
              <button className="btn" onClick={() => setShowMore(true)}>Show More</button>
            </div>
          )}
        </div>
        {selectedUser && (
          <div className={`user-details ${isMobile ? 'mobile' : ''}`}>
            <div className="selected-user-details">
              <button className="close-button" onClick={handleCloseDetails}>×</button>
              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div>
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={formData.fName}
                      onChange={(e) => setFormData({ ...formData, fName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={formData.lName}
                      onChange={(e) => setFormData({ ...formData, lName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Address:</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Company:</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>City:</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Country:</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="user-actions">
                    <button className="btn" type="submit">Save</button>
                    <button className="btn delete" onClick={() => confirmDeleteUser(selectedUser.id)}>Delete</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>{selectedUser.fName} {selectedUser.lName}</h2>
                  <p>Address: {selectedUser.address}</p>
                  <p>Company: {selectedUser.company}</p>
                  <p>City: {selectedUser.city}</p>
                  <p>Country: {selectedUser.country}</p>
                  <p>Phone: {selectedUser.phone}</p>
                  <div className="user-actions">
                    <button className="btn edit" onClick={handleEdit}>Edit</button>
                    <button className="btn delete" onClick={() => confirmDeleteUser(selectedUser.id)}>Delete</button>
                  </div>
                </>
              )}
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
};

export default HomePage;
