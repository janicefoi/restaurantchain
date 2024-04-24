import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FaGlassCheers, FaCoffee, FaShoppingCart, FaMinus, FaPlus, FaClipboardList  } from 'react-icons/fa';

const BranchMenu = () => {
  const location = useLocation();
  const branchId = location.pathname.split('/').pop();
  console.log('Extracted Branch ID:', branchId); // Debugging
  const customerId = localStorage.getItem('customerId'); 
  const history = useHistory(); // Use useHistory

  const [branchName, setBranchName] = useState('');
  const [drinks, setDrinks] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    console.log('Branch ID:', branchId); // Debugging

    const fetchBranchNameAndDrinks = async () => {
      try {
        // Fetch branch name using branch ID
        const branchResponse = await fetch(`http://localhost:5002/api/branches/${branchId}`);
        const branchData = await branchResponse.json();
        if (branchResponse.ok) {
          setBranchName(branchData.name);
        } else {
          console.error('Failed to fetch branch name:', branchData.error);
        }

        // Fetch drinks using branch ID
        const drinksResponse = await fetch(`http://localhost:5002/api/drinks/branch/${branchId}`);
        const drinksData = await drinksResponse.json();
        if (drinksResponse.ok) {
          setDrinks(drinksData.data);
          // Initialize quantities with default value of 1 for each drink
          const initialQuantities = drinksData.data.reduce((acc, drink) => {
            acc[drink._id] = 1;
            return acc;
          }, {});
          setQuantities(initialQuantities);
        } else {
          console.error('Failed to fetch drinks:', drinksData.error);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchBranchNameAndDrinks();
  }, [branchId]); // Fetch data whenever branchId changes

  const handleGoToCart = () => {
    history.push(`/branch-cart/${customerId}/${branchId}`); // Navigate to the BranchCart page with customer and branch IDs
  };

  const handleAddToCart = async (drinkId) => {
    try {
      // Calculate total price for the selected drink
      const drink = drinks.find(d => d._id === drinkId);
      const drinkQuantity = quantities[drinkId] || 1;
      const drinkTotalPrice = drink ? drink.price * drinkQuantity : 0;
  
      // Log the payload being sent to the updating cart logic
      console.log('Payload:', {
        customer: customerId,
        branch: branchId,
        drinks: [{ drink: drinkId, quantity: drinkQuantity }],
        totalPrice: drinkTotalPrice,
        drink: drinkId // Corrected to use 'drink' instead of 'drinkId'
      });
  
      // Check if there is an existing cart for the customer and branch
      const response = await fetch(`http://localhost:5002/api/cart/check?customer=${customerId}&branch=${branchId}`);
      const existingCart = await response.json();
  
      let updatedCart;
      if (!existingCart) {
        // If no existing cart, create a new cart
        const cartResponse = await fetch(`http://localhost:5002/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer: customerId,
            branch: branchId,
            totalPrice: drinkTotalPrice,
            drinks: [{ drink: drinkId, quantity: drinkQuantity }] // Include drinkId when creating a new cart
          })
        });
        updatedCart = await cartResponse.json();
        console.log('New Cart Created:', updatedCart);
      } else {
        // If existing cart, update the total price by adding the total price of the new drink
        const updatedTotalPrice = existingCart.totalPrice + drinkTotalPrice;
  
        // Add the selected drink to the existing cart
        const cartResponse = await fetch(`http://localhost:5002/api/cart/${existingCart._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            drinks: [...existingCart.drinks, { drink: drinkId, quantity: drinkQuantity }], // Include drinkId when adding to existing cart
            totalPrice: updatedTotalPrice,
            drink: drinkId // Corrected to use 'drink' instead of 'drinkId'
          })
        });
        updatedCart = await cartResponse.json();
        console.log('Drink Added to Existing Cart:', updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };         
   
  const handleIncrementQuantity = (drinkId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [drinkId]: (prevQuantities[drinkId] || 1) + 1 // Increment quantity
    }));
  };
  
  const handleDecrementQuantity = (drinkId) => {
    if (quantities[drinkId] > 1) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [drinkId]: (prevQuantities[drinkId] || 1) - 1 // Decrement quantity if it's greater than 1
      }));
    }
  };  

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{branchName && `${branchName}'s Menu`}</div>
          <div style={{ cursor: 'pointer' }} onClick={handleGoToCart}>
            <FaShoppingCart style={{ marginRight: '5px' }} />
            Branch Cart
          </div>
          <div style={{ cursor: 'pointer' }} onClick={() => history.push(`/branch-order/${customerId}/${branchId}`)}>
            <FaClipboardList style={{ marginRight: '5px' }} />
            Branch Order
          </div>
        </div>
      </nav>

      {/* Branch Menu */}
      <div style={{ textAlign: 'center' }}>
        <div className="drink-cards" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {drinks.map((drink, index) => (
            <div key={drink._id} className="drink-card" style={{ border: '1px solid #ccc', borderRadius: '4px', margin: '10px', padding: '10px', width: 'calc(25% - 20px)', backgroundColor: index % 2 === 0 ? 'orange' : 'white', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', transition: '0.3s' }}>
              <h3 style={{ marginBottom: '10px' }}>{drink.name}</h3>
              <p><FaGlassCheers /> Size: {drink.size}</p>
              <p><FaCoffee /> Price: Ksh {drink.price}</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <button onClick={() => handleDecrementQuantity(drink._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', color: '#000' }}><FaMinus style={{ fontSize: '20px' }} /></button>
                <span style={{ margin: '0 10px', fontSize: '18px' }}>{quantities[drink._id]}</span>
                <button onClick={() => handleIncrementQuantity(drink._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px', color: '#000' }}><FaPlus style={{ fontSize: '20px' }} /></button>
              </div>
              <button onClick={() => handleAddToCart(drink._id)} style={{ backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', marginTop: '10px' }}>
                <FaShoppingCart style={{ marginRight: '5px' }} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchMenu;
