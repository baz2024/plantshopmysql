import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  CardContent
} from "@mui/material";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // get product ID from route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Box sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Box>;
  }

  if (!product) {
    return <Typography sx={{ mt: 5, textAlign: "center" }}>Product not found</Typography>;
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h4">{product.name}</Typography>
          <Typography variant="h6" color="text.secondary">{product.category}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Price: €{product.price}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;