import React, { useState, useEffect } from 'react';
import { FaStoreAlt, FaMapMarkerAlt, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import BranchMenu from './BranchMenu'; 

const CustomerDashboard = () => {
  const history = useHistory();
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    const customerNameFromStorage = localStorage.getItem('customerName');
    if (customerNameFromStorage) {
      setCustomerName(customerNameFromStorage);
    } else {
      console.error('Customer name not found in local storage');
    }
  
    const customerEmailFromStorage = localStorage.getItem('customerEmail');
    console.log('Customer Email:', customerEmailFromStorage);
  
    const customerIdFromStorage = localStorage.getItem('customerId');
    if (customerIdFromStorage) {
      setCustomerId(customerIdFromStorage);
    } else {
      console.error('Customer ID not found in local storage');
    }
  
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/branches');
        const data = await response.json();
        if (response.ok) {
          setBranches(data);
        } else {
          console.error('Failed to fetch branches:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }
    };
  
    fetchBranches();
  }, []);

  const handleSeeMenu = (branchId) => {
    setSelectedBranchId(branchId);
    console.log('Selected Branch ID:', branchId);
    history.push(`/branch-menu/${branchId}`); // Navigate to the branch menu page
  };
  
  const handleCustomerCarts = () => {
    history.push(`/customer-carts/${customerId}`); // Navigate to the customer carts page with customer ID
  };
  
  const handleCustomerOrders = () => {
    history.push(`/customer-orders/${customerId}`); // Navigate to the customer orders page with customer ID
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">{customerName}'s Dashboard</div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={handleCustomerCarts}>
            <FaShoppingCart />
            Customer Carts
          </button>
          <button className="nav-button" onClick={handleCustomerOrders}>
            <FaClipboardList />
            Customer Orders
          </button>
        </div>
      </nav>

      <div className="branch-cards">
        {branches.map(branch => (
          <div key={branch._id} className="branch-card">
            <h3>{branch.name}</h3>
            <p><FaMapMarkerAlt /> Location: {branch.location}</p>
            <button className="btn-see-menu" onClick={() => handleSeeMenu(branch._id)}>
              <FaStoreAlt /> See Branch Menu
            </button>
          </div>
        ))}
      </div>

      <style>
        {`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: orange;
          padding: 1rem;
          color: #fff;
        }

        .navbar-brand {
          font-size: 1.5rem;
        }

        .nav-buttons {
          display: flex;
          align-items: center;
        }

        .branch-cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 20px;
        }

        .branch-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          margin: 10px;
          padding: 20px;
          width: 250px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .branch-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .branch-card p {
          margin: 5px 0;
        }

        .btn-see-menu {
          background-color: orange;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-see-menu:hover {
          background-color: darkorange;
        }

        .nav-button {
          background-color: orange;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          margin-left: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
        }

        .nav-button:hover {
          background-color: darkorange;
        }

        .nav-button svg {
          margin-right: 5px;
        }
        `}
      </style>
    </div>
  );
}

export default CustomerDashboard;
