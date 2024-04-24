import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCoffee, FaMoneyBillAlt, FaGlassCheers, FaMoneyCheckAlt, FaInfoCircle } from 'react-icons/fa'; // Importing icons


const BranchOrder = () => {
  const { customerId, branchId } = useParams(); // Extract customer ID and branch ID from URL
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [branchName, setBranchName] = useState('');


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders data using customer and branch IDs
        const ordersResponse = await fetch(`http://localhost:5002/api/orders/${customerId}/${branchId}`);
        const ordersData = await ordersResponse.json();
        if (ordersResponse.ok) {
          // Ensure ordersData.data is an array before mapping
          if (Array.isArray(ordersData.data)) {
            const updatedOrders = await Promise.all(ordersData.data.map(async (order) => {
              const updatedDrinks = await Promise.all(order.drinks.map(async (item) => {
                if (item.drink) {
                  const drinkResponse = await fetch(`http://localhost:5002/api/drinks/${item.drink}`);
                  const drinkData = await drinkResponse.json();
                  return { ...item, drinkDetails: drinkData.data }; // Add drink details to each item
                }
                return item;
              }));
              return { ...order, drinks: updatedDrinks };
            }));
            setOrders(updatedOrders);
          } else {
            console.error('Failed to fetch orders:', ordersData.data.error);
          }
        } else {
          console.error('Failed to fetch orders:', ordersData.error);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    const fetchCustomerAndBranch = async () => {
      try {
        // Fetch customer data
        const customerResponse = await fetch(`http://localhost:5002/api/customers/${customerId}`);
        const customerData = await customerResponse.json();
        if (customerResponse.ok) {
          setCustomerName(customerData.data.name);
        }

        // Fetch branch data
        const branchResponse = await fetch(`http://localhost:5002/api/branches/${branchId}`);
        const branchData = await branchResponse.json();
        if (branchResponse.ok) {
          setBranchName(branchData.name);
        }
      } catch (error) {
        console.error('Failed to fetch customer or branch:', error);
      }
    };

    fetchOrders();
    fetchCustomerAndBranch();
  }, [customerId, branchId]);

  return (
    <div style={{ maxWidth: '100%', margin: 'auto', backgroundColor: '#f2f2f2', padding: '20px' }}>
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        {customerName && branchName && (
          <h2 style={{ textAlign: 'center' }}>{`${customerName}'s ${branchName} Branch Orders`}</h2>
        )}
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', width: '100%', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '8px', position: 'relative' }}>
          {orders.length > 0 ? (
            orders.map((order, orderIndex) => (
              <div key={orderIndex} style={{ marginBottom: '20px', backgroundColor: orderIndex % 2 === 0 ? '#fff' : 'orange', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                {/* Display drink details in cards */}
                {order.drinks.map((item, itemIndex) => (
                  <div key={itemIndex} style={{ marginTop: '10px', position: 'relative' }}>
                    <p><FaCoffee /> Drink Name: {item.drinkDetails ? item.drinkDetails.name : 'Unknown'}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p><FaGlassCheers /> Size: {item.drinkDetails ? item.drinkDetails.size : 'Unknown'}</p>
                    <p><FaMoneyBillAlt /> Price: {item.drinkDetails ? item.drinkDetails.price : 'Unknown'}</p>
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
              </div>
            ))
          ) : (
            <p>No orders found for this branch and customer.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchOrder;
