import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const AddDrink = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [size, setSize] = useState('small');
  const [error, setError] = useState('');
  const history = useHistory();
  const location = useLocation();
  const branchName = location.state ? location.state.branchName : null;
  const branchId = location.state ? location.state.branchId : null; // Retrieve branch ID from location state

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'buyingPrice') {
      if (!isNaN(value)) {
        if (value >= 0) {
          if (name === 'price') setPrice(value);
          else setBuyingPrice(value);
        }
      }
    } else {
      if (name === 'size') setSize(value);
      else setName(value);
    }
  };

  const handleAddDrink = async (e) => {
    e.preventDefault();
    try {
      console.log({ name, price, buyingPrice, size, branch: branchId }); // Log branch ID
      const response = await fetch('http://localhost:5002/api/drinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, buyingPrice, size, branch: branchId }), // Pass branch ID instead of name
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Drink added:', data);
        // Clear the form
        setName('');
        setPrice('');
        setBuyingPrice('');
        setSize('small');
        setError('');
      } else {
        console.error('Failed to add drink:', data.error);
        setError('Failed to add drink. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add drink:', error);
      setError('Failed to add drink. Please try again.');
    }
  };        

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Drink</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddDrink} style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name:</label>
          <input type="text" name="name" value={name} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Price:</label>
          <input type="number" name="price" value={price} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Buying Price:</label>
          <input type="number" name="buyingPrice" value={buyingPrice} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Size:</label>
          <select name="size" value={size} onChange={handleChange} style={styles.input} required>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>Add Drink</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    marginBottom: '1rem',
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
    cursor: 'pointer',
  },
};

export default AddDrink;
