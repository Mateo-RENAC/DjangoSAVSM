import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const SearchBar = ({ columns, setFilterConfig }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterConfig(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, setFilterConfig]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div style={{ display: 'flex', marginBottom: '20px' }}>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
            />
        </div>
    );
};

export default SearchBar;
