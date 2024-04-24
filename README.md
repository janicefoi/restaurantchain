# Drink Sales Management System

## Overview
The Drink Sales Management System is a web application designed to automate the operations of a business enterprise that sells drinks of a particular brand. The system allows customers to place orders, which are processed locally at the branch and reflected globally at the headquarters. It provides reports on total sales and profits at both the branch and headquarters levels, and includes a re-order signal to indicate the need for restocking.

## Features

### Customer Side
- **User Authentication**: Customers can sign up and log in to their accounts.
- **Branch Selection**: Customers can view available branches and select the nearest one.
- **Menu Browsing**: Customers can browse the menu of each branch and add drinks to their cart.
- **Order Placement**: Customers can place orders and view their order history.

### Branch Dashboard
- **Branch Authentication**: Branches can log in using their credentials.
- **Menu Management**: Branches can add drinks to their menu.
- **Order Management**: Branches can view and manage orders, including changing order statuses.
- **Sales and Profits**: Branches can view their sales and profits reports.

### Headquarters Dashboard
- **Headquarters Authentication**: Headquarters can log in using their credentials.
- **Branch Management**: Headquarters can create new branches and view details of existing branches.
- **Order Tracking**: Headquarters can view orders from all branches.
- **Total Sales and Profits**: Headquarters can view total sales and profits across all branches.

## Technologies Used
- **Frontend**: React.js, React Router, Axios, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Other Tools**: Git, GitHub, Postman

## Installation
To run this application locally, follow these steps:
1. Clone this repository.
2. Navigate to the `frontend` and `backend` directories separately and run `npm install` to install dependencies.
3. Set up MongoDB and configure the connection in the backend.
4. Run `npm start` in both the `frontend` and `backend` directories to start the development servers.

## Contributors
- [Janice Wambui](https://github.com/janicefoi) - Developer

## License
This project is licensed under the [MIT License](LICENSE).
