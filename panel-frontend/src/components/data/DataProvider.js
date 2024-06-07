import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '@/lib/axiosConfig';

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

const DataProvider = ({ children, tableName, limit = 50, sortConfig, filterConfig, page }) => {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const columnsResponse = await axiosInstance.get(`/tables/${tableName}/columns/`);
                setColumns(columnsResponse.data.columns);

                const params = {
                    limit,
                    ordering: sortConfig.key && (sortConfig.direction === 'asc' ? sortConfig.key : `-${sortConfig.key}`),
                    search: filterConfig,
                    page,
                };

                const rowsResponse = await axiosInstance.get(`/tables/${tableName}/rows/`, { params });
                setRows(rowsResponse.data.results);
                setFilteredRows(rowsResponse.data.results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tableName, limit, sortConfig, filterConfig, page]);

    return (
        <DataContext.Provider value={{ columns, rows, filteredRows, setFilteredRows, error, loading, setColumns, setRows }}>
            {children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
    tableName: PropTypes.string.isRequired,
    limit: PropTypes.number,
    sortConfig: PropTypes.object,
    filterConfig: PropTypes.string,
    page: PropTypes.number,
};

export default DataProvider;
