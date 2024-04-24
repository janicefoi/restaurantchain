import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt } from 'react-icons/fa'; // Import dollar sign icon
import axios from 'axios';

const TotalSales = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/total-sales');
        setTotalSales(response.data.totalSales);
      } catch (error) {
        console.error('Error fetching total sales:', error);
        setError('Error fetching total sales');
      }
    };

    fetchTotalSales();
  }, []);

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navbarTitle}>Total Sales</div>
      </nav>
      <div style={styles.content}>
        <div style={styles.totalSalesContainer}>
          <FaMoneyBillAlt  style={styles.icon} />
          <div style={styles.totalSales}>{totalSales}</div>
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
  totalSalesContainer: {
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '1rem'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  totalSales: {
    fontSize: '2rem',
    fontWeight: 'bold'
  }
};

export default TotalSales;
