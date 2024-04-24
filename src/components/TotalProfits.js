import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt} from 'react-icons/fa'; // Import dollar sign icon
import axios from 'axios';

const TotalProfits = () => {
  const [totalProfits, setTotalProfits] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalProfits = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/total-profits');
        setTotalProfits(response.data.totalProfits);
      } catch (error) {
        console.error('Error fetching total profits:', error);
        setError('Error fetching total profits');
      }
    };

    fetchTotalProfits();
  }, []);

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navbarTitle}>Total Profits</div>
      </nav>
      <div style={styles.content}>
        <div style={styles.totalProfitsContainer}>
          <FaMoneyBillAlt style={styles.icon} />
          <div style={styles.totalProfits}>{totalProfits}</div>
        </div>
        {error && <div>Error: {error}</div>}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navbarTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  content: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  totalProfitsContainer: {
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '1rem'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  totalProfits: {
    fontSize: '2rem',
    fontWeight: 'bold'
  }
};

export default TotalProfits;
