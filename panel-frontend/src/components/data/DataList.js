import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SearchBar from '../common/SearchBar';
import TableHeader from '../common/TableHeader';
import TableBodyContent from '../common/TableBodyContent';
import { DataProvider } from '@/components/Data/DataProvider';

const DataList = ({ dataUrl }) => {
    const [columns, setColumns] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
    const [filteredData, setFilteredData] = useState([]);

    return (
        <DataProvider tableName={dataUrl}>
            <SearchBar columns={columns} setFilteredData={setFilteredData} data={filteredData} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHeader
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        setColumns={setColumns}
                        additionalColumn="Actions"
                    />
                    <TableBodyContent
                        columns={columns}
                        additionalColumn="Actions"
                        readOnly={true}
                    />
                </Table>
            </TableContainer>
        </DataProvider>
    );
};

export default DataList;
