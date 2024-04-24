import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaGlassCheers, FaMoneyBill, FaCoffee } from 'react-icons/fa';

const BranchDashboard = () => {
  const history = useHistory();
  const location = useLocation();
  const branchName = new URLSearchParams(location.search).get('name');
  const [drinks, setDrinks] = useState([]);
  const [branchId, setBranchId] = useState(null); // Add branchId state

  useEffect(() => {
    const fetchBranchIdAndDrinks = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/branches/name/${branchName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const branchData = await response.json();
        if (response.ok) {
          const drinksResponse = await fetch(`http://localhost:5002/api/drinks/branch/${branchData._id}`);
          const drinksData = await drinksResponse.json();
          if (drinksResponse.ok) {
            setDrinks(drinksData.data);
            setBranchId(branchData._id); // Set the branchId state
          } else {
            console.error('Failed to fetch drinks:', drinksData.error);
          }
        } else {
          console.error('Failed to fetch branch ObjectId:', branchData.error);
        }
      } catch (error) {
        console.error('Failed to fetch branch ObjectId:', error);
      }
    };

    if (branchName) {
      fetchBranchIdAndDrinks();
    }
  }, [branchName]);

  const handleAddDrink = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/branches/name/${branchName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        history.push({
          pathname: '/add-drink',
          state: { branchName: branchName, branchId: data._id }
        });
      } else {
        console.error('Failed to fetch branch ObjectId:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch branch ObjectId:', error);
    }
  };

  const handleBranchOrders = () => {
    history.push(`/branch-orders/${branchId}`);
  };

  const handleBranchSales = () => {
    history.push(`/branch-sales/${branchId}`);
  };
  const handleBranchProfits = () => {
    history.push(`/branch-profits/${branchId}`);
  };
  return (
    <div className="branch-dashboard">
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'orange', color: '#fff' }}>
        <div style={{ fontSize: '1.5rem' }}>{branchName} Dashboard</div>
        <div>
          <button style={{ marginRight: '1rem', padding: '0.5rem 1rem', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleAddDrink}>Add Drink</button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleBranchOrders}>Branch Orders</button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleBranchSales}>Branch Sales</button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleBranchProfits}>Branch Profits</button>
        </div>
      </nav>

      {/* Title */}
      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>{branchName} Drinks</h2>

      {/* Drink Cards */}
      <div className="drink-cards" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {drinks.map((drink, index) => (
          <div key={drink._id} className="drink-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '4px', width: '200px', backgroundColor: index % 2 === 0 ? 'orange' : 'white' }}>
            <h3>{drink.name}</h3>
            <p><FaGlassCheers /> Size: {drink.size}</p>
            <p><FaCoffee /> Price: Ksh {drink.price}</p>
            <p><FaMoneyBill /> Buying Price: Ksh {drink.buyingPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDashboard;
