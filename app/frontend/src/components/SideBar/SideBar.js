import React from 'react';
import './SideBar.css';

const Sidebar = ({ companies, onCompanyClick }) => (
  <aside className="sidebar">
    <h3>Companies</h3>
    <ul>
      {companies.map((company, index) => (
        <li key={index} onClick={() => onCompanyClick(company)}>{company}</li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;