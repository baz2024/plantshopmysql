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
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5001/api/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load categories. Make sure you're logged in as admin.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    setError("");
    if (!name || !price || !categoryId) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/products",
        {
          name,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          imageUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setName("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.response?.data || "Failed to add product.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Products
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Price (€)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Paper>
        <List>
          {products.map((product) => (
            <ListItem
              key={product.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${product.name} - €${product.price}`}
                secondary={`Category ID: ${product.categoryId}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}