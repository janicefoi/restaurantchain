// Import necessary modules
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCoffee, FaMoneyBillAlt, FaGlassCheers } from 'react-icons/fa'; // Importing icons

// Define the CustomerOrders component
const CustomerOrders = () => {
  // Extract customer ID from URL
  const { customerId } = useParams();
  // Define state variables to store orders and customer name
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Function to fetch customer orders
  const fetchOrders = async () => {
    try {
      // Fetch customer orders using the customer ID
      const response = await fetch(`http://localhost:5002/api/customer-orders/${customerId}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error('Failed to fetch customer orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    }
  };

  // Function to fetch customer data
  const fetchCustomerData = async () => {
    try {
      // Fetch customer data using the customer ID
      const response = await fetch(`http://localhost:5002/api/customers/${customerId}`);
      const data = await response.json();
      if (response.ok) {
        setCustomerName(data.name);
      } else {
        console.error('Failed to fetch customer data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  // Fetch orders and customer data when the component mounts
  useEffect(() => {
    fetchOrders();
    fetchCustomerData();
  }, [customerId]);

  // Return JSX to render the component
  return (
    <div style={{ maxWidth: '100%', margin: 'auto', backgroundColor: '#f2f2f2', padding: '20px' }}>
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        {customerName && <h2 style={{ textAlign: 'center' }}>{`${customerName}'s Orders`}</h2>}
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', padding: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h3>{order.branchName} Branch Order</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Time Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              {order.drinks.map((item, index) => (
                <div key={index} style={{ position: 'relative', marginBottom: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <h4>Drink {index + 1}</h4>
                  <p>Quantity: {item.quantity}</p>
                  {/* Display drink details in cards */}
                  {item.drinkDetails && (
                    <div style={{ marginTop: '10px' }}>
                      <p><FaCoffee /> Drink Name: {item.drinkDetails.name}</p>
                      <p><FaGlassCheers /> Size: {item.drinkDetails.size}</p>
                      <p><FaMoneyBillAlt /> Price: {item.drinkDetails.price}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export the CustomerOrders component
export default CustomerOrders;
