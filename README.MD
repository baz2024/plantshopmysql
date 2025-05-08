
# 🌿 Full Stack E-Commerce Plant Shop Tutorial (React + Node.js + MySQL + JWT)

This tutorial guides you through building a fully functional e-commerce web application for a plant shop using:

- 🌐 **React + MUI** for the frontend
- ⚙️ **Node.js + Express** for the backend
- 🛢️ **MySQL** for persistent data storage
- 🔐 **JWT** for secure user authentication and role-based access

---

## 1. 🔧 Project Setup

### 1.1 Frontend (Vite + React + MUI)

```bash
npm create vite@latest plant-shop-client --template react
cd plant-shop-client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom axios
```

### 1.2 Backend (Node.js + Express + MySQL)

```bash
mkdir plant-shop-server
cd plant-shop-server
npm init -y
npm install express cors dotenv mysql2 jsonwebtoken bcryptjs
```

---

## 2. 🛠️ MySQL Database Setup

### 2.1 Create Tables

Run the following SQL script in MySQL Workbench or CLI:

```sql
CREATE DATABASE IF NOT EXISTS plant_shop;
USE plant_shop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  categoryId INT NOT NULL,
  imageUrl TEXT,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);
```

### 2.2 Insert Sample Data

```sql
-- Categories
INSERT INTO categories (name, value) VALUES 
('Flowers', 'flower'),
('Trees', 'tree'),
('Herbs', 'herb');

-- Products (use valid categoryId values)
INSERT INTO products (name, price, categoryId, imageUrl) VALUES 
('Rose', 10.00, 1, 'https://images.app.goo.gl/aAGcMr9hC53ChHbM9'),
('Lavender', 5.50, 3, 'https://images.app.goo.gl/5SQ1BpfhRT6x1ZL86'),
('Maple Tree', 80.00, 2, 'https://images.app.goo.gl/gmzaXUMzHPgf4vU36');
```

### 2.3 Promote a User to Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## 3. 🔐 Environment Configuration

Create a `.env` file in your `plant-shop-server` folder:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=plant_shop
JWT_SECRET=your_super_secure_jwt_key
```
Here’s how you can securely generate a JWT_SECRET on both Windows and macOS/Linux systems:

⸻

🔐 Generating JWT_SECRET Securely

To sign JWT tokens safely, you need a strong, random secret string. Here’s how to generate one:

⸻

🪟 Windows (Command Prompt or PowerShell)

✅ Using PowerShell:

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```
📌 Copy the result and paste it into your .env file like this:

JWT_SECRET=PASTE_YOUR_SECRET_HERE


⸻

🍎 macOS / 🐧 Linux (Terminal)

✅ Using OpenSSL:

```
openssl rand -base64 64
```

📌 Then add it to .env:

JWT_SECRET=PASTE_YOUR_SECRET_HERE


⸻

⚠️ Important Notes
	•	Keep this secret private! Never commit it to GitHub.
	•	Regenerate it if you believe it’s been exposed.
	•	Do not use weak strings like "123" or "secret".

⸻ 

## 4. 🧠 Backend Logic (`server.js`)

The server includes:

- Registration & login
- JWT middleware
- Admin protection
- CRUD for products and categories

[See full server.js content above in the tutorial.]

---

## 5. 🧑‍💻 Frontend Architecture

Your React project should include:

- `Signup.jsx`, `Signin.jsx` – Auth screens
- `AdminCategories.jsx`, `ProductAdmin.jsx` – Admin panels
- `ProductListPage.jsx` – Public product viewer
- `App.jsx` with React Router routes

[See full code for each component in the tutorial.]

---

## 6. ✅ Final Touches

- Start backend: `node server.js`
- Start frontend: `npm run dev`
- Test login, admin access, product add/delete

✅ You're now running a real full-stack app with role-based access and product management!

---

