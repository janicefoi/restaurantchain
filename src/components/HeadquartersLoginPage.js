//HeadquartersLoginPage.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const HeadquartersLoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  const [loginError, setLoginError] = useState('');

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
      console.log('Payload:', formData);
      const response = await fetch('http://localhost:5002/api/headquarters/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      console.log('Response status:', response.status); // Log response status
  
      const responseBody = await response.json(); // Parse response body regardless of status
      console.log('Response:', responseBody);
  
      if (response.ok) {
        console.log('Login successful:', responseBody);
        // Redirect to headquarters dashboard upon successful login
        history.push('/headquarters/dashboard');
      } else {
        console.error('Error logging in:', responseBody);
        setLoginError('Error logging in. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred while logging in');
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Headquarters Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </div>
  );
}

// Inline styles
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

export default HeadquartersLoginPage;
