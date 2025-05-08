import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>🌿 Plant Shop</Typography>

        {token && (
          <>
            <Button color="inherit" href="/products">Products</Button>
            {role === 'admin' && (
              <>
                <Button color="inherit" href="/admin/categories">Category Admin</Button>
                <Button color="inherit" href="/admin/products">Product Admin</Button>
              </>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}

        {!token && (
          <>
            <Button color="inherit" href="/signin">Sign In</Button>
            <Button color="inherit" href="/signup">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;