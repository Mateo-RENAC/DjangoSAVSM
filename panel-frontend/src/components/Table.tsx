import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const DataTable = ({ dataUrl }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [draftData, setDraftData] = useState({});

  useEffect(() => {
    fetchData();
  }, [dataUrl]);

  const fetchData = () => {
    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        setData(data);
        // Automatically generate columns from the first item
        if (data.length > 0) {
          const columnNames = Object.keys(data[0]);
          const formattedColumns = columnNames.map(name => ({
            field: name,
            label: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')  // Capitalize and replace underscores
          }));
          setColumns(formattedColumns);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const toggleEdit = (item) => {
    setEditRowId(item.id);
    setDraftData(item);
  };

  const cancelEdit = () => {
    setEditRowId(null);
    setDraftData({});
  };

  const handleEditChange = (field, value) => {
    setDraftData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = (id) => {
    const updateUrl = `${dataUrl}${id}/`; // Ensure this URL matches your Django endpoint
    fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      return response.json();
    })
    .then(updatedItem => {
      setData(data.map(item => item.id === id ? { ...item, ...updatedItem } : item));
      setEditRowId(null);
      setDraftData({});
    })
    .catch(error => console.error('Failed to update:', error));
  };

  const deleteItem = (id) => {
    const deleteUrl = `${dataUrl}${id}/`; // Ensure this URL matches your Django endpoint
    fetch(deleteUrl, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      setData(data.filter(item => item.id !== id));
    })
    .catch(error => console.error('Failed to delete:', error));
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
        onChange={event => console.log(event.target.value)}
        placeholder="Search..."
      />
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
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map(column => (
                  <TableCell key={column.field}>
                    {editRowId === item.id ? (
                      <TextField
                        value={draftData[column.field] || ''}
                        onChange={(e) => handleEditChange(column.field, e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item[column.field]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editRowId === item.id ? (
                    <>
                      <IconButton onClick={() => saveEdit(item.id)}><SaveIcon /></IconButton>
                      <IconButton onClick={cancelEdit}><CancelIcon /></IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => toggleEdit(item)}><EditIcon /></IconButton>
                      <IconButton onClick={() => deleteItem(item.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;