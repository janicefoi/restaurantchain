import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCoffee, FaMoneyBillAlt, FaGlassCheers, FaTrash, FaMoneyCheckAlt, FaInfoCircle, FaClock } from 'react-icons/fa'; // Importing icons

const CustomerOrders = () => {
  const { customerId } = useParams(); // Extract customer ID from URL
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch the customer's orders
        const response = await fetch(`http://localhost:5002/api/customer-orders/${customerId}`);
        const data = await response.json();
        if (response.ok) {
          // Fetch branch name for each order and drink details for each drink in the order
          const updatedOrders = await Promise.all(data.map(async (order) => {
            // Fetch branch name for the order
            const branchResponse = await fetch(`http://localhost:5002/api/branches/${order.branch}`);
            const branchData = await branchResponse.json();
            const branchName = branchData.name;

            // Fetch drink details for each drink in the order
            const updatedDrinks = await Promise.all(order.drinks.map(async (item) => {
              if (item.drink) {
                const drinkResponse = await fetch(`http://localhost:5002/api/drinks/${item.drink}`);
                const drinkData = await drinkResponse.json();
                return { ...item, drinkDetails: drinkData.data }; // Add drink details to each item
              }
              return item;
            }));

            return { ...order, branchName, drinks: updatedDrinks };
          }));
          setOrders(updatedOrders);
        } else {
          console.error('Failed to fetch customer orders:', data.error);
        }

        // Fetch customer data
        const customerResponse = await fetch(`http://localhost:5002/api/customers/${customerId}`);
        const customerData = await customerResponse.json();
        if (customerResponse.ok) {
          setCustomerName(customerData.data.name);
        }
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      }
    };

    fetchOrders();
  }, [customerId]);

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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                  <FaMoneyCheckAlt style={{ marginRight: '5px' }} />
                  Total Price: {order.totalPrice}
                </div>
                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                  <FaInfoCircle style={{ marginRight: '5px' }} />
                  Status: {order.status}
                </div>
              </div>
              <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                <FaClock style={{ marginRight: '5px' }} />
                Order Time: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;
