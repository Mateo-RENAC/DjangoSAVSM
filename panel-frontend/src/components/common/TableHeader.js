import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useData } from '@/components/Data/DataProvider';

const TableHeader = ({ sortConfig, setSortConfig, additionalColumn }) => {
    const { columns } = useData();

    const handleSort = (columnKey) => {
        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === columnKey && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const getSortIndicator = (columnKey) => {
        if (sortConfig.key === columnKey) {
            if (sortConfig.direction === 'asc') return '↑';
            if (sortConfig.direction === 'desc') return '↓';
        }
        return null;
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.name}
                        onClick={() => handleSort(column.name)}
                        style={{ cursor: 'pointer', padding: '8px 8px' }}
                    >
                        {column.name} {getSortIndicator(column.name)}
                    </TableCell>
                ))}
                {additionalColumn && <TableCell>{additionalColumn}</TableCell>}
            </TableRow>
        </TableHead>
    );
};

export default TableHeader;
