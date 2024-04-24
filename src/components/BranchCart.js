import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCoffee, FaMoneyBillAlt, FaGlassCheers, FaTrash } from 'react-icons/fa'; // Importing icons
import Swal from 'sweetalert2';

const BranchCart = () => {
  const { customerId, branchId } = useParams(); // Extract customer ID and branch ID from URL
  const [cart, setCart] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [branchName, setBranchName] = useState('');

  // Placeholder function to handle removing a drink from the cart
  const handleRemoveDrink = (drinkId) => {
    console.log(`Removing drink with ID ${drinkId}`);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Fetch the cart data using customer and branch IDs
        const cartResponse = await fetch(`http://localhost:5002/api/cart/${customerId}/${branchId}`);
        const cartData = await cartResponse.json();
        if (cartResponse.ok) {
          // Fetch drink details for each drink in the cart
          const updatedDrinks = await Promise.all(cartData.drinks.map(async (item) => {
            if (item.drink) {
              const drinkResponse = await fetch(`http://localhost:5002/api/drinks/${item.drink}`);
              const drinkData = await drinkResponse.json();
              return { ...item, drinkDetails: drinkData.data }; // Add drink details to each item
            }
            return item;
          }));
          setCart({ ...cartData, drinks: updatedDrinks });
        } else {
          console.error('Failed to fetch cart:', cartData.error);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
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

    fetchCart();
    fetchCustomerAndBranch();
  }, [customerId, branchId]);

  // Function to make an order
  const handleMakeOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerId,
          branch: branchId,
          drinks: cart.drinks.map(item => ({
            drink: item.drink,
            quantity: item.quantity
          })),
          totalPrice: cart.totalPrice // Include the totalPrice field
        })
      });
  
      if (response.ok) {
        console.log('Order created successfully.');
  
        // Clear the cart
        setCart(null);
  
        // Delete the cart from the database
        const deleteCartResponse = await fetch(`http://localhost:5002/api/cart/${cart._id}`, {
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

      return (
        <div style={{ maxWidth: '100%', margin: 'auto', backgroundColor: '#f2f2f2', padding: '20px' }}>
          <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
            {customerName && branchName && (
              <h2 style={{ textAlign: 'center' }}>{`${customerName}'s ${branchName} Branch Cart`}</h2>
            )}
          </nav>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '500px', width: '100%', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '8px', position: 'relative' }}>
              {cart ? (
                <>
                  {cart.drinks.map((item, index) => (
                    <div key={index} style={{ position: 'relative', marginBottom: '20px', backgroundColor: index % 2 === 0 ? '#fff' : 'orange', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <h3>Drink {index + 1}</h3>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <button style={{ backgroundColor: 'orange', color: '#fff', padding: '15px 30px', borderRadius: '8px', border: 'none', fontSize: '16px' }}>
                      Total Price: {cart.totalPrice}
                    </button>
                    <button style={{ backgroundColor: 'green', color: '#fff', padding: '15px 30px', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer' }} onClick={handleMakeOrder}>
                      Make Order
                    </button>
                  </div>
                </>
              ) : (
                <p>You Do not have a cart in this branch. please add items to your cart</p>
              )}
            </div>
          </div>
        </div>
      );
    };
    

export default BranchCart;
