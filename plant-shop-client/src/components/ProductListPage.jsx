import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import axios from "axios";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_base_url = import.meta.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    axios.get(`${API_base_url}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
  }, []);

  const getImagePath = (imageFileName) => {
    try {
      return new URL(`../assets/images/${imageFileName}`, import.meta.url).href;
    } catch {
      return "https://via.placeholder.com/180?text=Image+Missing";
    }
  };

  if (loading) return <Box sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">All Products</Typography>
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
             <CardMedia
  component="img"
  height="180"
  image={`${API_base_url}${p.imageUrl}`} // this is the uploaded image
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/180?text=No+Image";
  }}
/>
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