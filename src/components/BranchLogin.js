import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const BranchLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make API call to authenticate branch
    try {
      const response = await fetch('http://localhost:5002/api/branches/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Authentication successful, redirect to branch dashboard with branch name as a query parameter
        history.push(`/branch/dashboard?name=${name}`);
      } else {
        // Authentication failed, display error message
        setError(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Branch Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Branch Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <Link to="/" style={styles.link}>Back to Home</Link>
    </div>
  );
};

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
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '1rem'
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
  },
  error: {
    color: 'red',
    marginBottom: '1rem'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none'
  }
};

export default BranchLogin;
