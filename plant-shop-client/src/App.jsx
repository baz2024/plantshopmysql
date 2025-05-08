import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProductListPage from './components/ProductListPage';
import AdminCategories from './components/AdminCategories';
import ProductAdmin from './components/ProductAdmin';
import CssBaseline from '@mui/material/CssBaseline';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<ProductAdmin />} />
        
      </Routes>
    </Router>
  );
}

export default App;