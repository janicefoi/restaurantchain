// Existing imports...
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCoffee, FaMoneyBillAlt, FaGlassCheers, FaTrash } from 'react-icons/fa'; // Importing icons
import Swal from 'sweetalert2';

const CustomerCarts = () => {
  const { customerId } = useParams(); // Extract customer ID from URL
  const [carts, setCarts] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Placeholder function to handle removing a drink from the cart
  const handleRemoveDrink = (drinkId) => {
    console.log(`Removing drink with ID ${drinkId}`);
  };

  // Function to make an order
  const handleMakeOrder = async (customerId, branchId, drinks, totalPrice, cartId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerId,
          branch: branchId,
          drinks: drinks.map(item => ({
            drink: item.drink,
            quantity: item.quantity
          })),
          totalPrice: totalPrice // Include the totalPrice field
        })
      });
  
      if (response.ok) {
        console.log('Order created successfully.');
  
        // Delete the cart from the database
        const deleteCartResponse = await fetch(`http://localhost:5002/api/cart/${cartId}`, {
          method: 'DELETE',
        });
  
        if (deleteCartResponse.ok) {
          console.log('Cart deleted successfully.');
        } else {
          console.error('Failed to delete cart:', deleteCartResponse.statusText);
        }
  
        // Show a popup box indicating successful order creation
        Swal.fire({
          icon: 'success',
          title: 'Order Created Successfully!',
          showConfirmButton: true,
          confirmButtonColor: 'orange',
          confirmButtonText: 'OK',
        });
  
        // Optionally, you can reset the cart state or redirect the user to another page
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        // Fetch the customer's carts
        const response = await fetch(`http://localhost:5002/api/customer-carts/${customerId}`);
        const data = await response.json();
        if (response.ok) {
          // Fetch drink details for each drink in the carts
          const updatedCarts = await Promise.all(data.map(async (cart) => {
            // Fetch branch name for each cart
            const branchResponse = await fetch(`http://localhost:5002/api/branches/${cart.branch}`);
            const branchData = await branchResponse.json();
            const branchName = branchData.name;

            // Fetch drink details for each drink in the cart
            const updatedDrinks = await Promise.all(cart.drinks.map(async (item) => {
              if (item.drink) {
                const drinkResponse = await fetch(`http://localhost:5002/api/drinks/${item.drink}`);
                const drinkData = await drinkResponse.json();
                return { ...item, drinkDetails: drinkData.data }; // Add drink details to each item
              }
              return item;
            }));

            return { ...cart, branchName, drinks: updatedDrinks };
          }));
          setCarts(updatedCarts);
        } else {
          console.error('Failed to fetch customer carts:', data.error);
        }

        // Fetch customer data
        const customerResponse = await fetch(`http://localhost:5002/api/customers/${customerId}`);
        const customerData = await customerResponse.json();
        if (customerResponse.ok) {
          setCustomerName(customerData.data.name);
        }
      } catch (error) {
        console.error('Error fetching customer carts:', error);
      }
    };

    fetchCarts();
  }, [customerId]);

  return (
    <div style={{ maxWidth: '100%', margin: 'auto', backgroundColor: '#f2f2f2', padding: '20px' }}>
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        {customerName && <h2 style={{ textAlign: 'center' }}>{`${customerName}'s Carts`}</h2>}
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', padding: '20px' }}>
          {carts.map(cart => (
            <div key={cart._id} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h3>{cart.branchName} Branch Cart</h3>
              {cart.drinks.map((item, index) => (
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
                  {/* Trash icon */}
                  <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                    <FaTrash style={{ cursor: 'pointer' }} onClick={() => handleRemoveDrink(item._id)} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Orange button to show total price */}
                <button style={{ backgroundColor: 'orange', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  Total Price: {cart.totalPrice}
                </button>
                {/* Green button to make order */}
                <button style={{ backgroundColor: 'green', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} onClick={() => handleMakeOrder(customerId, cart.branch, cart.drinks, cart.totalPrice, cart._id)}>
                  Make Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerCarts;
