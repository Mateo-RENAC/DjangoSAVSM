import React, { useState, useEffect, useRef } from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import axiosInstance from '@/lib/axiosConfig';
import { useData } from '@/components/Data/DataProvider';

const TableBodyContent = ({ columns, tableName, additionalColumn, editUrl, deleteUrl, newRow, handleCancelNewRow, handleSaveNewRow, setNewRow }) => {
    const { rows = [], setRows } = useData(); // Default to empty array if rows is undefined
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingValues, setEditingValues] = useState({});
    const tableRef = useRef(null);

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setEditingValues(item);
    };

    const handleValueChange = (e, column) => {
        setEditingValues({ ...editingValues, [column.name]: e.target.value });
    };

    const handleSaveClick = async (item) => {
        try {
            const response = await axiosInstance.put(editUrl || `/tables/${tableName}/${item.id}/`, editingValues);
            setRows((prevRows) => prevRows.map((dataItem) => (dataItem.id === item.id ? response.data : dataItem)));
            setEditingItemId(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteClick = async (item) => {
        try {
            await axiosInstance.delete(deleteUrl || `/tables/${tableName}/${item.id}/`);
            setRows((prevRows) => prevRows.filter((dataItem) => dataItem.id !== item.id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCancelClick = () => {
        setEditingItemId(null);
    };

    const handleClickOutside = (e) => {
        if (tableRef.current && !tableRef.current.contains(e.target)) {
            handleCancelClick();
        }
    };

    useEffect(() => {
        if (editingItemId || newRow) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingItemId, newRow]);

    const renderActions = (item) => (
        <div>
            {editingItemId === item.id ? (
                <>
                    <IconButton onClick={() => handleSaveClick(item)}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                        <CloseIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <IconButton onClick={() => handleEditClick(item)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )}
        </div>
    );

    return (
        <TableBody ref={tableRef}>
            {newRow && (
                <TableRow>
                    {columns.map((column) => (
                        <TableCell key={column.name} style={{ padding: '8px 8px' }}>
                            <TextField
                                value={newRow[column.name] || ''}
                                onChange={(e) => setNewRow({ ...newRow, [column.name]: e.target.value })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSaveNewRow();
                                }}
                            />
                        </TableCell>
                    ))}
                    <TableCell>
                        <IconButton onClick={handleSaveNewRow}>
                            <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelNewRow}>
                            <CloseIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )}
            {rows.map((item) => (
                <TableRow key={item.id}>
                    {columns.map((column) => (
                        <TableCell key={column.name} style={{ padding: '8px 8px' }}>
                            {editingItemId === item.id ? (
                                <TextField
                                    value={editingValues[column.name]}
                                    onChange={(e) => handleValueChange(e, column)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleSaveClick(item);
                                    }}
                                />
                            ) : (
                                item[column.name]
                            )}
                        </TableCell>
                    ))}
                    <TableCell>{renderActions(item)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default TableBodyContent;
