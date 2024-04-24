import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMoneyCheckAlt, FaClock, FaCoffee, FaGlassCheers, FaMoneyBillAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const BranchOrders = () => {
  const { branchId } = useParams();
  const [orders, setOrders] = useState([]);
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (branchId) {
          const response = await fetch(`http://localhost:5002/api/branch-orders/${branchId}`);
          const data = await response.json();
          if (response.ok) {
            const ordersWithDetails = await Promise.all(data.data.map(async (order) => {
              // Fetch customer name
              const customerResponse = await fetch(`http://localhost:5002/api/customers/${order.customer}`);
              const customerData = await customerResponse.json();
              const customerName = customerResponse.ok ? customerData.data.name : 'Unknown Customer';

              // Fetch drink details for each drink in the order
              const drinkDetails = await Promise.all(order.drinks.map(async (drink) => {
                const drinkResponse = await fetch(`http://localhost:5002/api/drinks/${drink.drink}`);
                const drinkData = await drinkResponse.json();
                const drinkDetail = drinkResponse.ok ? drinkData.data : null;
                return {
                  ...drink,
                  name: drinkDetail ? drinkDetail.name : 'Unknown Drink',
                  size: drinkDetail ? drinkDetail.size : 'Unknown Size',
                  price: drinkDetail ? drinkDetail.price : 0,
                };
              }));

              return {
                ...order,
                customerName,
                drinks: drinkDetails,
              };
            }));
            setOrders(ordersWithDetails);
          } else {
            console.error('Failed to fetch branch orders:', data.error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch branch orders:', error);
      }
    };

    const fetchBranchName = async () => {
      try {
        if (branchId) {
          const response = await fetch(`http://localhost:5002/api/branches/${branchId}`);
          const data = await response.json();
          if (response.ok) {
            setBranchName(data.name);
          } else {
            console.error('Failed to fetch branch name:', data.error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch branch name:', error);
      }
    };

    fetchOrders();
    fetchBranchName();
  }, [branchId]);

// Function to handle status update
const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    console.log('Updating status for orderId:', orderId); // Add this line

    const response = await fetch(`http://localhost:5002/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();

    console.log('Response:', data); // Add this line to see the response

    if (response.ok) {
      // Update the status of the order in the UI
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show a success message using Swal.fire
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order status updated successfully!',
      });
    } else {
      // Show an error message using Swal.fire
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error || 'Failed to update order status',
      });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    // Show an error message using Swal.fire
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update order status. Please try again later.',
    });
  }
};


  return (
    <div>
      {/* Orange navbar */}
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '1rem', marginBottom: '3rem' }}>
        <h2>{branchName && `${branchName} Orders`}</h2>
      </nav>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', padding: '0 1rem' }}>
        {orders.map(order => (
          <div key={order._id} style={{ width: '45%', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', backgroundColor: '#e0e0e0' }}>
            <h3>{order.customerName}'s Order</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}> {/* Remove default bullet points */}
              {order.drinks.map(drink => (
                <li key={drink._id}>
                  <p>Quantity: {drink.quantity}</p>
                  <p><FaCoffee /> Drink Name: {drink.name}</p>
                  <p><FaGlassCheers />Size: {drink.size}</p>
                  <p><FaMoneyBillAlt />Price: {drink.price}</p>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <div style={{ backgroundColor: '#f0f0f0', color: '#000', padding: '10px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                <FaMoneyCheckAlt style={{ marginRight: '5px' }} />
                Total Price: {order.totalPrice}
              </div>
              <div>
                <label htmlFor={`status-${order._id}`}>Status:</label>
                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={e => handleStatusUpdate(order._id, e.target.value)}
                  style={{ backgroundColor: order.status === 'ordered' ? 'green' : '#f0f0f0', color: order.status === 'ordered' ? '#fff' : '#000', padding: '10px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}
                >
                  <option value="ordered">Ordered</option>
                  <option value="received">Received</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', color: '#000', padding: '10px', borderRadius: '5px', marginTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              <FaClock style={{ marginRight: '5px' }} />
              Order Time: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchOrders;
