import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMoneyBillAlt } from 'react-icons/fa';

const BranchProfits = () => {
  const { branchId } = useParams();
  const [branchName, setBranchName] = useState('');
  const [branchProfits, setBranchProfits] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/branches/${branchId}`);
        const data = await response.json();
        if (response.ok) {
          setBranchName(data.name);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch branch details:', error);
        setError('Failed to fetch branch details');
      }
    };

    const fetchBranchProfits = async () => {
      try {
        console.log('branchId:', branchId); // Log branchId here
        const response = await fetch(`http://localhost:5002/api/branch-profits/${branchId}`);
        const data = await response.json();
        if (response.ok) {
          setBranchProfits(data.branchProfits);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch branch profits:', error);
        setError('Failed to fetch branch profits');
      }
    };

    fetchBranchDetails();
    fetchBranchProfits();
  }, [branchId]);

  return (
    <div>
      <nav style={{ backgroundColor: 'orange', color: '#fff', padding: '0.5rem', marginBottom: '1rem' }}>
        <h2>{branchName && `${branchName}'s Profits`}</h2>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', marginTop: '2rem' }}>
          <FaMoneyBillAlt style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Total Profits: ksh {branchProfits}
          </div>
        </div>
      </div>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default BranchProfits;
