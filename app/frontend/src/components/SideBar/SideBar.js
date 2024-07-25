import React from 'react';
import './SideBar.css';

const Sidebar = ({ companies, onCompanyClick, selectedCompany }) => (
  <aside className="sidebar">
    <h3>Company</h3>
    <ul>
      {companies.map((company, index) => (
        <li key={index}>
          <label>
            <input
              type="checkbox"
              checked={selectedCompany === company}
              onChange={() => onCompanyClick(company)}
            />
            <span className="company-name">{company}</span>
          </label>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
