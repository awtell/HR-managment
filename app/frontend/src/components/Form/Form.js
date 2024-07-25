import React, { useState, useEffect } from 'react';
import './Form.css';
import { postUser } from '../../api';

const Form = ({ formVisible, toggleFormVisibility }) => {
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    address: '',
    company: '',
    city: '',
    country: '',
    color: '#000000',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postUser(formData);
      alert('User created successfully');
      toggleFormVisibility();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  if (!formVisible) return null;

  return (
    <div className="form-wrapper">
      <div className="form-container" >
        <h2>Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input type='email' className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="First Name" name="fName" value={formData.fName} onChange={handleChange} required />
            <input type="text" className="form-control" placeholder="Last Name" name="lName" value={formData.lName} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Address" name="address" value={formData.address} onChange={handleChange} required />
            <input type="text" className="form-control" placeholder="City" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <select className="form-control" name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Select Country</option>
              <option value="Lebanon">Lebanon</option>
              {countries.map((country) => (
                country.name.common !== "Lebanon" && (
                  <option key={country.cca3} value={country.name.common}>
                    {country.name.common}
                  </option>
                )
              ))}
            </select>
          </div>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Company" name="company" value={formData.company} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="color" className="form-control" placeholder="Favorite Color" name="color" value={formData.color} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="btn-container">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={toggleFormVisibility}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default Form;