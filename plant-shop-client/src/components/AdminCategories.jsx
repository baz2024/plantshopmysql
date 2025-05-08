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
    const res = await axios.get("http://localhost:5001/api/categories", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCategories(res.data);
  };

  const addCategory = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5001/api/categories", { name, value }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName(""); setValue(""); fetchCategories();
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5001/api/categories/${id}`, {
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