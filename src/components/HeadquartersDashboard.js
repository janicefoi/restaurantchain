import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaMapMarkerAlt, FaDollarSign, FaMoneyBillAlt } from 'react-icons/fa'; // Import icons
import axios from 'axios'; // Import axios for API calls

const HeadquartersDashboard = () => {
  const [branches, setBranches] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch branches data from the API when component mounts
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchOrders = (branchId) => {
    history.push(`/branch-orders/${branchId}`);
  };

  return (
    <div>
      {/* Orange navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarTitle}>Headquarters Dashboard</div>
        <Link to="/create-branch" style={styles.navButton}>Create Branch</Link>
        <Link to="/total-sales" style={styles.navButton}>Total Sales</Link>
        <Link to="/total-profits" style={styles.navButton}>Total Profits</Link> {/* New button for total sales */}
      </nav>
      
      {/* Content */}
      <div style={styles.content}>
        {branches.map(branch => (
          <div key={branch._id} style={styles.branchCard}>
            <h3>{branch.name}</h3>
            <p><FaMapMarkerAlt /> Location: {branch.location}</p>
            <p><FaDollarSign /> Sales Data: {JSON.stringify(branch.sales)}</p>
            <p><FaMoneyBillAlt /> Profits Data: {JSON.stringify(branch.profits)}</p> {/* Add profits data */}
            {/* Add more details here if needed */}
            <button onClick={() => handleBranchOrders(branch._id)} style={styles.branchOrdersButton}>Branch Orders</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const styles = {
  navbar: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navbarTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  navButton: {
    backgroundColor: 'white',
    color: 'orange',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none'
  },
  content: {
    padding: '2rem',
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(90%, 1fr))', // Adjusted width
  },
  branchCard: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left'
  },
  branchOrdersButton: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    marginTop: '1rem',
    cursor: 'pointer'
  }
};

export default HeadquartersDashboard;
