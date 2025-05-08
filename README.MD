

# 🌿 Full Stack E-Commerce Plant Shop Tutorial (React + Node.js + MySQL + JWT)

This tutorial guides you through building a fully functional e-commerce web application for a plant shop using:

- 🌐 **React + MUI** for the frontend
- ⚙️ **Node.js + Express** for the backend
- 🛢️ **MySQL** for persistent data storage
- 🔐 **JWT** for secure user authentication and role-based access

---

## 1. 🔧 Project Setup
## 🧭 Project Structure Overview

### Frontend (`plant-shop-client`)
```
src/
├── components/
│   ├── Signup.jsx
│   ├── Signin.jsx
│   ├── AdminCategories.jsx
│   ├── ProductAdmin.jsx
│   └── ProductListPage.jsx
├── App.jsx
└── main.jsx
```

### Backend (`plant-shop-server`)
```
.
├── .env
├── server.js
└── node_modules/
```

---

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
###  `Backend ` (`server.js`)

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'plant_shop',
});

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
  res.sendStatus(201);
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0 || !await bcrypt.compare(password, users[0].password)) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// JWT middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  next();
};

// Category APIs
app.get('/api/categories', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories');
  res.json(rows);
});

app.post('/api/categories', authenticate, adminOnly, async (req, res) => {
  const { name, value } = req.body;
  await pool.query('INSERT INTO categories (name, value) VALUES (?, ?)', [name, value]);
  res.sendStatus(201);
});

app.delete('/api/categories/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

---
## 5. 🧑‍💻 Frontend Architecture

Your React project should include:

- `Signup.jsx`, `Signin.jsx` – Auth screens
- `AdminCategories.jsx`, `ProductAdmin.jsx` – Admin panels
- `ProductListPage.jsx` – Public product viewer
- `App.jsx` with React Router routes
## 5.1 App.jsx (`src/App.jsx`)
```
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProductListPage from './components/ProductListPage';
import AdminCategories from './components/AdminCategories';
import ProductAdmin from './components/ProductAdmin';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<ProductAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
```
### 5.2 React components/Signup.jsx Component

```jsx
import React from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await axios.post("http://localhost:5001/api/register", {
      email: data.get("email"),
      password: data.get("password")
    });
    navigate("/signin");
  };

  const handleGoToSignin = () => {
    navigate("/signin");
  };
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth name="email" label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained">Register</Button>
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ mt: 1 }} 
            onClick={handleGoToSignin}
          >
            Already have an account? Sign In
          </Button> 
        </Box>
      </Box>
    </Container>
  );
}
```

---

### 5.3 React `(components/Signin)` Component

```jsx
import React from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await axios.post("http://localhost:5001/api/login", {
      email: data.get("email"),
      password: data.get("password")
    });
    localStorage.setItem("token", res.data.token);
    navigate("/products");
  };

  // Example: Add a "Forgot Password?" button
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth name="email" label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained">Login</Button>
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ mt: 1 }} 
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <a href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign up
            </a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
```

---

### 5.4 Admin Category Page (`components/AdminCategories.jsx`)

```jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/categories", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCategories(res.data);
  };

  const addCategory = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/categories", { name, value }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName(""); setValue(""); fetchCategories();
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCategories();
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Admin: Manage Categories</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
        <Button variant="contained" onClick={addCategory}>Add</Button>
      </Box>
      <List>
        {categories.map((cat) => (
          <ListItem key={cat.id} secondaryAction={
            <IconButton edge="end" onClick={() => deleteCategory(cat.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            {cat.name} ({cat.value})
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
```


-
### 5.5 Admin Product Management Page (`components/	ProductAdmin.jsx`)

```jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !price || !category) return;
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/products", {
      name,
      price: Number(price),
      category,
      imageUrl
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName(""); setPrice(""); setCategory(""); setImageUrl("");
    fetchProducts();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Products
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField fullWidth label="Price (€)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button fullWidth variant="contained" onClick={handleAddProduct}>Add</Button>
        </Grid>
      </Grid>

      <Paper>
        <List>
          {products.map((product) => (
            <ListItem
              key={product.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${product.name} - €${product.price}`}
                secondary={`${product.category}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
```
---

### 5.6 Product Listing Page (`src/components/ProductListPage.jsx`)

This component fetches and displays all products from the backend.

```jsx
import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">All Products</Typography>
      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardMedia component="img" height="180" image={p.imageUrl || "https://via.placeholder.com/180"} />
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">{p.category}</Typography>
                <Typography fontWeight="bold">€{p.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductListPage;
```

---



✅ You're now fully set up with:
- JWT login
- Admin-only product/category management
- Public product listing with Axios + MUI cards
---

## 🔒 Fixed `/api/login` Route with bcrypt + JWT

Update this in your `server.js` to properly compare passwords and sign tokens:

```js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) return res.status(401).send("Invalid credentials");

    const match = await bcrypt.compare(password, users[0].password);

    if (!match) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
});
```

✅ Ensure your `.env` file includes:

```
JWT_SECRET=your_secure_key_here
```



## 6. ✅ Final Touches

- Start backend: `node server.js`
- Start frontend: `npm run dev`
- Test login, admin access, product add/delete
- To access the admin pages you must signin with admin user and type the follwoing paths:
- [x] [http://localhost:5174/admin/categories](http://localhost:5174/admin/categories)
- [x] [http://localhost:5174/admin/products](http://localhost:5174/admin/products)

✅ You're now running a real full-stack app with role-based access and product management!

---

