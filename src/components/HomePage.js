import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="background-image"></div>
      <div className="button-container">
        <Link to="/customer" className="home-button">Customer</Link>
        <Link to="/branch/login" className="home-button">Branch</Link>
        <Link to="/headquarters/login" className="home-button">Headquarters</Link> {/* Update path to /headquarters/login */}
      </div>
      <div className="content">
        <h1>Welcome to Our Drink Ordering System</h1>
        <p>Please select your role to proceed:</p>
      </div>
    </div>
  );
}

export default HomePage;
