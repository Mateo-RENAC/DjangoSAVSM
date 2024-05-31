"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  fetch('http://localhost:8000/panel/api/products/') // Direct URL for testing
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => setProducts(data))
    .catch(error => console.error('Error fetching products:', error));
  }, []);
  /*useEffect(() => {
    console.log('Fetching products from /panel/api/products/');
    fetch('/panel/api/products/')
      .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data:', data);
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });*/

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.reference}</TableCell>
              <TableCell>{product.user_name}</TableCell>
              <TableCell>{product.stock_count}</TableCell>
              <TableCell>
                <IconButton aria-label="info" onClick={() => handleInfoClick(product)}>
                  <InfoIcon />
                </IconButton>
                <IconButton aria-label="edit" onClick={() => handleEditClick(product)}>
                  <EditIcon />
                </IconButton>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(product.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  function handleInfoClick(product) {
    console.log('Info clicked for:', product);
  }

  function handleEditClick(product) {
    console.log('Edit clicked for:', product);
  }

  // @ts-ignore
  function handleDeleteClick(productId) {
    console.log('Delete clicked for product ID:', productId);
  }
};

export default ProductTable;