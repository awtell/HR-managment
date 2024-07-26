import React, { useState, useEffect } from 'react';
import './SideBar.css';

const Sidebar = ({ companies, onCompanyClick, selectedCompanies, toggleFormVisibility, sidebarMinimized, toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set the mobile breakpoint
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const filteredCompanies = companies
    .filter(company => company.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <aside className={`sidebar ${sidebarMinimized ? 'minimized' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {sidebarMinimized ? '>' : '<'}
      </button>
      {!sidebarMinimized && (
        <>
          <button className="btn create-employee" onClick={toggleFormVisibility}>Create Employee</button>
          <h3>Company</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-box"
            />
            {searchTerm && <button className="clear-button" onClick={clearSearch}>×</button>}
          </div>
          <ul>
            {filteredCompanies.map((company, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company)}
                    onChange={() => onCompanyClick(company)}
                  />
                  <span className="company-name">{company}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
