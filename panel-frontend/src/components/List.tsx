export {}; // Assurez-vous que cette ligne est au tout début du fichier

import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

const DataTable = ({ dataUrl, columns }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetch(dataUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [dataUrl]);

  const parseSearchQuery = (query) => {
    const [columnsPart, valuePart] = query.split(':');
    const searchColumns = columnsPart ? columnsPart.split(',') : [];
    const searchValue = valuePart || '';
    return { searchColumns, searchValue };
  };

  const filteredData = data
    .filter(item => {
      const { searchColumns, searchValue } = parseSearchQuery(searchQuery);

      if (searchColumns.length === 0) {
        // If no specific columns are specified, search in all columns
        return columns.some(column =>
          item[column.field].toString().toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      return searchColumns.some(col =>
        item[col]?.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === '') return 0;
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '20px' }}
          placeholder="col1,col2:value"
        />
        <FormControl variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            {columns.map(column => (
              <MenuItem key={column.field} value={column.field}>{column.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.field}>{column.label}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                {columns.map(column => (
                  <TableCell key={column.field}>{item[column.field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton aria-label="info" onClick={() => handleInfoClick(item)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  function handleInfoClick(item) {
    console.log('Info clicked for:', item);
  }
};

export default DataTable;