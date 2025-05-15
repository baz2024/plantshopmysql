
# 🌱 Deploy `plantshopmysql` (React + Node.js + MySQL) on Render + Railway

This guide explains how to deploy your full-stack project:
- Frontend: React on **Render (Static Site)**
- Backend: Node.js + Express on **Render (Web Service)**
- Database: MySQL hosted on **Railway**

---

## 🗂 Project Structure

```
plantshopmysql/
├── plant-shop-client/        # React frontend
├── plant-shop-server/        # Node.js backend (Express + MySQL)
└── .env.example   # Sample environment variables
```

---

## ✅ Step 1: Deploy MySQL Database on Railway

1. Go to [https://railway.app](https://railway.app)
2. Click **“New Project” > “Provision MySQL”**
3. Copy the credentials:
   - Host
   - Port
   - User
   - Password
   - Database name

Example `.env` for backend:

```
DB_HOST=containers-us-west-xx.railway.app
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=plantshop
PORT=10000
```

> 🔐 Make sure to enable external access if needed.

---

## 🌐 Step 2: Deploy Backend on Render

1. Go to [https://render.com](https://render.com)
2. Click **"New Web Service"**
3. Connect your GitHub repo
4. Set root directory: `/plant-shop-server`
5. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

6. Add environment variables from your Railway MySQL credentials.

---

## 🌐 Step 3: Deploy Frontend on Render

1. Click **"New Static Site"** in Render
2. Set root directory: `/plant-shop-client`
3. Use:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

4. Add the following environment variable:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🔁 Step 4: Connect Frontend to Backend

In `plant-shop-client/src/api/index.js`, make sure your base URL looks like this:

```js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:10000";
```

---

## 🔒 Optional: Improve Backend with CORS and Compression

In `plant-shopserver/server.js`:

```js
const cors = require('cors');
const compression = require('compression');

app.use(cors());
app.use(compression());
```

---

## ✅ Deployment Summary

| Component   | Platform       | Example URL                              |
|-------------|----------------|-------------------------------------------|
| Frontend    | Render Static Site | `https://plantshop-frontend.onrender.com` |
| Backend     | Render Web Service | `https://plantshop-backend.onrender.com`  |
| Database    | Railway MySQL     | External DB connection                  |

---

## 🧪 Final Check

- Visit your frontend Render URL
- Confirm products and data load from backend
- Use browser dev tools to debug CORS or fetch issues if needed

---

**Done! Your full-stack app is now live on Render with MySQL on Railway.**
