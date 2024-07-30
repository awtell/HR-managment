import React, { useState, useEffect } from 'react';
import './Form.css';
import { postUser } from '../../api';

const Form = ({ formVisible, toggleFormVisibility, formType }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fName: '',
    lName: '',
    address: '',
    company: '',
    city: '',
    country: '',
    color: '#000000',
    phone: '',
    role: '',
    image: './assets/images/profile.png',
  });

  const [canEdit, setCanEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setCanEdit(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      role: canEdit ? 'RU' : 'R',
    };

    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();
    for (const key in updatedFormData) {
      formDataToSend.append(key, updatedFormData[key]);
    }

    // Append image file if it exists
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await postUser(formDataToSend, formType); // Send FormData instead of JSON
      alert(`${formType === 'admin' ? 'Admin' : 'Employee'} created successfully`);
      toggleFormVisibility();
    } catch (error) {
      console.error(`Error creating ${formType}:`, error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
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
      <div className="form-container">
        <h2>{formType === 'admin' ? 'Create Admin' : 'Registration Form'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input type='email' className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group mb-3">
            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {formType !== 'admin' && (
            <>
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
                  {countries.map((country) => (
                    <option key={country.cca3} value={country.name.common}>{country.name.common}</option>
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
                <label>
                  <input type="checkbox" checked={canEdit} onChange={handleCheckboxChange} />
                  Can Edit
                </label>
                <input type="file" className="form-control" name="image" onChange={handleImageChange} required />
              </div>
            </>
          )}
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
