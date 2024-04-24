import React, { useState } from 'react';
import './CustomerPage.css';

const CustomerPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        // Store customer details in local storage
        localStorage.setItem('customerName', data.name);
        localStorage.setItem('customerEmail', email); // Store email instead of name
        // Redirect to customer dashboard after successful login
        window.location.href = '/customer-dashboard';
      } else {
        setSignupError(data.error);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setSignupError('Signup failed. Please try again later.');
    }
  };
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        // Store customer email in local storage
        localStorage.setItem('customerEmail', email);
        // After successful login
        localStorage.setItem('customerId', data.customer._id);
        // Extract and store customer name
       const customerName = data.customer.name;
        localStorage.setItem('customerName', customerName);
        console.log('customerEmail:', email);
        console.log('customerName:', customerName);
        // Redirect to customer dashboard after successful login
        window.location.href = '/customer-dashboard';
      } else {
        setLoginError(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again later.');
    }
  };
    

  return (
    <div className="customer-page">
      <nav className="navbar">
        <div className="navbar-brand">DrinkOrders</div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <button onClick={() => { setShowSignUp(false); setShowLogin(true); }} className="nav-link">Login</button>
          </li>
          <li className="navbar-item">
            <button onClick={() => { setShowLogin(false); setShowSignUp(true); }} className="nav-link">Sign Up</button>
          </li>
        </ul>
      </nav>

      {showLogin && (
        <div className="signup-form-container">
          <h2>Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          {loginError && <p className="error-message">{loginError}</p>}
        </div>
      )}

      {showSignUp && (
        <div className="signup-form-container">
          <h2>Sign Up</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
          </form>
          {signupError && <p className="error-message">{signupError}</p>}
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
