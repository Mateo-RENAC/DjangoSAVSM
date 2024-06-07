import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SearchBar from '../common/SearchBar';
import TableHeader from '../common/TableHeader';
import TableBodyContent from '../common/TableBodyContent';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DataProvider, { useData } from '@/components/Data/DataProvider';
import axiosInstance from '@/lib/axiosConfig';

const DataTableRaw = ({
    dataUrl,
    addUrl,
    editUrl,
    deleteUrl,
    sortConfig,
    setSortConfig,
    filterConfig,
    setFilterConfig,
    page,
    setPage,
}) => {
    const { columns, filteredRows, setRows, loading } = useData();
    const [newRow, setNewRow] = useState(null);

    const handleAddItem = () => {
        setNewRow({});
    };

    const handleCancelNewRow = () => {
        setNewRow(null);
    };

    const handleSaveNewRow = async () => {
        try {
            const response = await axiosInstance.post(addUrl || `/${dataUrl}/`, newRow);
            setRows((prevData) => [...prevData, response.data]);
            setNewRow(null);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <IconButton onClick={handleAddItem}>
                <AddIcon />
            </IconButton>
            <SearchBar
                columns={columns}
                setFilterConfig={setFilterConfig}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHeader
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        additionalColumn="Actions"
                    />
                    <TableBodyContent
                        columns={columns}
                        tableName={dataUrl}
                        additionalColumn="Actions"
                        editUrl={editUrl}
                        deleteUrl={deleteUrl}
                        newRow={newRow}
                        handleCancelNewRow={handleCancelNewRow}
                        handleSaveNewRow={handleSaveNewRow}
                        setNewRow={setNewRow}
                    />
                </Table>
            </TableContainer>
            {/* Add pagination component here if needed */}
        </div>
    );
};

const DataTable = (props) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
    const [filterConfig, setFilterConfig] = useState('');
    const [page, setPage] = useState(1);

    return (
        <DataProvider
            tableName={props.dataUrl}
            sortConfig={sortConfig}
            filterConfig={filterConfig}
            page={page}
        >
            <DataTableRaw
                {...props}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                filterConfig={filterConfig}
                setFilterConfig={setFilterConfig}
                page={page}
                setPage={setPage}
            />
        </DataProvider>
    );
};

export default DataTable;