// components/list.tsx
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const List = ({ dataUrl, columns }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

  useEffect(() => {
    fetch(dataUrl)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [dataUrl]);

  const parseSearchQuery = (query) => {
    let searchColumns = [];
    let searchValue = query;
    let operator = ':';

    if (query.includes(':')) {
      [searchColumns, searchValue] = query.split(':');
      searchColumns = searchColumns ? searchColumns.split(',') : [];
      operator = ':';
    } else if (query.includes('=')) {
      [searchColumns, searchValue] = query.split('=');
      searchColumns = searchColumns ? searchColumns.split(',') : [];
      operator = '=';
    } else if (query.includes('>')) {
      [searchColumns, searchValue] = query.split('>');
      searchColumns = searchColumns ? searchColumns.split(',') : [];
      operator = '>';
    } else if (query.includes('<')) {
      [searchColumns, searchValue] = query.split('<');
      searchColumns = searchColumns ? searchColumns.split(',') : [];
      operator = '<';
    } else {
      // Default to the first column if no operator is present
      searchColumns = [columns[0].field];
      searchValue = query;
    }

    // Convert searchColumns to lowercase
    searchColumns = searchColumns.map(col => col.toLowerCase());

    return { searchColumns, searchValue: searchValue.toLowerCase(), operator };
  };

  const filteredData = data
    .filter(item => {
      const { searchColumns, searchValue, operator } = parseSearchQuery(searchQuery);

      return searchColumns.some(col => {
        const itemValue = String(item[col]).toLowerCase();

        switch (operator) {
          case ':':
            return itemValue.includes(searchValue);
          case '=':
            return itemValue === searchValue;
          case '>':
            return parseFloat(itemValue) > parseFloat(searchValue);
          case '<':
            return parseFloat(itemValue) < parseFloat(searchValue);
          default:
            return false;
        }
      });
    })
    .sort((a, b) => {
      if (sortConfig.key === null || sortConfig.direction === 'default') return 0;
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
      return 0;
    });

  const handleSort = (columnKey) => {
    let direction = 'ascending';
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === columnKey && sortConfig.direction === 'descending') {
      direction = 'default';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'ascending') return '↑';
      if (sortConfig.direction === 'descending') return '↓';
    }
    return null;
  };

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
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '1px', padding: '0 8px' }}></TableCell>
              {columns.map(column => (
                <TableCell
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  style={{ cursor: 'pointer', padding: '8px 8px' }}
                >
                  {column.label} {getSortIndicator(column.field)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell style={{ padding: '0 8px' }}>
                  <IconButton onClick={() => console.log('Info clicked for:', item)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
                {columns.map(column => (
                  <TableCell key={column.field} style={{ padding: '8px 8px' }}>{item[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default List;
