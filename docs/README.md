# Breakfast Order System 1.1

## Overview

The **Breakfast Order System 1.1** is a web-based application that helps users place and manage breakfast orders efficiently. The backend is built with Express.js, and it uses MySQL as the database. 

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MySQL server
- Git

Make sure the above tools are installed on your system.

## Set Up

### Step 1: Clone the Repository

Start by cloning this repository to your local machine:

```bash
git clone https://github.com/yourusername/breakfast-order-system-1.1.git
cd breakfast-order-system-1.1
```

### Step 2: Install Dependencies

After navigating into the project directory, install the required dependencies using npm or yarn:

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of your project to store your environment variables:

```bash
touch .env
```

Add the following to your `.env` file, replacing values where necessary:

```env
DB_USER={your-user-name}
DB_PASSWORD={your-password}
DB_NAME=breakfast_order_system
DB_HOST=localhost
DB_PORT=3306
```

### Step 4: Set Up the MySQL Database

1. Log into your MySQL server:
   ```bash
   sudo mysql -u root -p
   ```
2. Create the database and user:
   ```sql
   CREATE DATABASE breakfast_order_system;
   CREATE USER '{your-user-name}'@'localhost' IDENTIFIED BY '{your-password}';
   GRANT ALL PRIVILEGES ON breakfast_order_system.* TO '{your-user-name}'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```
3. Create the tables needed for the application:
   ```sql
   USE breakfast_order_system;

   CREATE TABLE orders (
     id INT AUTO_INCREMENT PRIMARY KEY,
     orderId INT,
     customerName VARCHAR(255) NOT NULL,
     contact VARCHAR(100) NOT NULL,
     pickupTime DATETIME NOT NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE order_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     orderId INT,
     itemName VARCHAR(255) NOT NULL,
     quantity INT NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
   );
   ```

### Step 5: Start Coding

To begin coding, you can start the development server using the following command:

```bash
npm run dev
```

Or, if you use yarn:

This will start the development server and watch for changes.

## Project Structure

- `routes/` - Defines the API routes for handling breakfast orders.
- `models/` - Contains database models for interacting with MySQL.
- `controllers/` - Contains the logic for handling incoming requests and managing data.
- `views/` - Contains views if applicable (in case of server-side rendering).
- `public/` - Static files like CSS, JavaScript, and images.

## Running the Server

To run the server in production mode, use:

```bash
npm start
```

The server should be available at `http://localhost:3000` by default.

## Contributing
Feel free to submit pull requests or open issues for suggestions and improvements.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.