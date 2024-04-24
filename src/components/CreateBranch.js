// CreateBranch.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const CreateBranch = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    password: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        history.push('/headquarters/dashboard'); // Redirect to dashboard upon successful branch creation
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      setError('An error occurred while creating the branch.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Branch</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
        </div>
        <button type="submit" style={styles.button}>Create</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  heading: {
    marginBottom: '1rem',
    color: '#333'
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  },
  inputContainer: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'orange',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default CreateBranch;
