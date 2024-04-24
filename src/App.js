import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomerPage from './components/CustomerPage';
import CustomerDashboard from './components/CustomerDashboard';
import HeadquartersLoginPage from './components/HeadquartersLoginPage';
import HeadquartersDashboard from './components/HeadquartersDashboard';
import BranchLogin from './components/BranchLogin';
import BranchDashboard from './components/BranchDashboard';
import AddDrink from './components/AddDrink';
import TotalSales from './components/TotalSales';
import TotalProfits from './components/TotalProfits';
import CreateBranch from './components/CreateBranch';
import BranchOrders from './components/BranchOrders'; 
import BranchSales from './components/BranchSales';
import BranchProfits from './components/BranchProfits';
import BranchMenu from './components/BranchMenu';
import BranchCart from './components/BranchCart';
import BranchOrder from './components/BranchOrder';
import CustomerCarts from './components/CustomerCarts';
import CustomerOrders from './components/CustomerOrders';

function App() {
  return (
    <Router>
      <div className="app">
        <Route path="/" exact component={HomePage} />
        <Route path="/customer" component={CustomerPage} />
        <Route path="/customer-dashboard" component={CustomerDashboard} />
        <Route path="/customer-carts/:customerId" component={CustomerCarts} />
        <Route path="/customer-orders/:customerId" component={CustomerOrders} />
        <Route path="/branch/login" exact component={BranchLogin} />
        <Route path="/branch/dashboard" exact component={BranchDashboard} />
        <Route path="/headquarters/login" component={HeadquartersLoginPage} />
        <Route path="/headquarters/dashboard" component={HeadquartersDashboard} />
        <Route path="/create-branch" component={CreateBranch} />
        <Route path="/total-sales" component={TotalSales} />
        <Route path="/total-profits" component={TotalProfits} />
        <Route path="/add-drink" component={AddDrink} />
        <Route path="/branch-orders/:branchId" exact component={BranchOrders} />
        <Route path="/branch-sales/:branchId" component={BranchSales} />
        <Route path="/branch-profits/:branchId" component={BranchProfits} />
        <Route path="/branch-menu" component={BranchMenu} />
        <Route path="/branch-cart/:customerId/:branchId" component={BranchCart} /> {/* Add route for BranchCart */}
        <Route path="/branch-order/:customerId/:branchId" component={BranchOrder} />
      </div>
    </Router>
  );
}

export default App;
