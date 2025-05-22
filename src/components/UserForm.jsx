import React, { useState } from 'react';
import { searchNPIRegistry, getNPIDetails, createUser } from '../services/npiService';
import { toast } from "@/components/ui/use-toast";
import './UserForm.css';

const UserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    npiNumber: '',
    password: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNPISearch = async () => {
    try {
      setIsSearching(true);
      const { firstName, lastName, npiNumber } = formData;
      
      if (!firstName && !lastName && !npiNumber) {
        toast({
          title: "Search Error",
          description: "Please enter NPI number or provider name to search",
          variant: "destructive",
        });
        return;
      }

      const results = await searchNPIRegistry({ firstName, lastName, npiNumber });
      setSearchResults(results.results || []);
      
      if (results.results?.length === 0) {
        toast({
          title: "No Results",
          description: "No providers found matching your search criteria",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('NPI Search failed:', error);
      toast({
        title: "Search Failed",
        description: error.response?.data?.error || "Failed to search providers",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNPISelect = async (npi) => {
    try {
      const details = await getNPIDetails(npi.number);
      setFormData(prev => ({
        ...prev,
        npiNumber: details.number,
        firstName: details.basic.first_name,
        lastName: details.basic.last_name,
        middleName: details.basic.middle_name || ''
      }));
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to fetch NPI details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch provider details",
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'npiNumber'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createUser(formData);
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
      });
      onSubmit(response);
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form">
      <h2>Create New User</h2>
      
      <div className="npi-search-section">
        <h3>NPI Search</h3>
        <div className="search-inputs">
          <input
            type="text"
            name="npiNumber"
            placeholder="Enter NPI number"
            value={formData.npiNumber}
            onChange={handleInputChange}
          />
          <span>OR</span>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <button 
            type="button" 
            onClick={handleNPISearch}
            disabled={isSearching}
            className={isSearching ? 'loading' : ''}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div 
                key={result.number}
                className="result-item"
                onClick={() => handleNPISelect(result)}
              >
                <p>{result.basic.first_name} {result.basic.last_name}</p>
                <p>NPI: {result.number}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Last Name*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 