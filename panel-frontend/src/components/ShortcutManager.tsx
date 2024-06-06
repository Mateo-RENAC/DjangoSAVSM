import React, { useState, useEffect } from 'react';

const ShortcutManager = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState('');
    const [actionType, setActionType] = useState('');
    const [actionValue, setActionValue] = useState('');

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = () => {
        fetch('http://localhost:8000/panel/get_table_list/')
            .then(response => response.json())
            .then(data => {
                setTables(data.tables);
            })
            .catch(error => {
                console.error('Error fetching tables:', error);
            });
    };

    const fetchColumns = async (tableName) => {
        try {
            const response = await fetch(`http://localhost:8000/panel/get_column_list/?table_name=${tableName}`);
            const data = await response.json();
            setColumns(data.columns || []);
        } catch (error) {
            console.error('Error fetching columns:', error);
            setColumns([]);
        }
    };

    const fetchRows = async () => {
        if (selectedTable && selectedColumn) {
            try {
                const response = await fetch(`http://localhost:8000/panel/get_rows/?table_name=${selectedTable}&column_name=${selectedColumn}`);
                const data = await response.json();
                setRows(data.rows || []);
            } catch (error) {
                console.error('Error fetching rows:', error);
                setRows([]);
            }
        }
    };

    const handleTableChange = async (event) => {
        const tableName = event.target.value;
        setSelectedTable(tableName);
        setSelectedColumn('');
        setSelectedRow('');
        setActionType('');
        setActionValue('');

        if (tableName) {
            await fetchColumns(tableName);
            await fetchRows(tableName);
        }
    };

    const handleColumnChange = (event) => {
        setSelectedColumn(event.target.value);
    };

    const handleRowChange = (event) => {
        setSelectedRow(event.target.value);
    };

    const handleActionTypeChange = (event) => {
        setActionType(event.target.value);
    };

    const handleActionValueChange = (event) => {
        setActionValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Logique pour créer le raccourci
        const shortcut = {
            actionType,
            actionValue,
            targetTable: selectedTable,
            targetColumn: selectedColumn,
            targetRow: selectedRow
        };

        fetch('http://localhost:8000/panel/create_shortcut/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shortcut)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shortcut created:', data);
            // Réinitialiser le formulaire
            setSelectedTable('');
            setColumns([]);
            setSelectedColumn('');
            setRows([]);
            setSelectedRow('');
            setActionType('');
            setActionValue('');
        })
        .catch(error => {
            console.error('Error creating shortcut:', error);
        });
    };

    return (
        <div>
            <h1>Gestionnaire de Raccourcis</h1>
            <div>
                <h2>Créer un nouveau raccourci</h2>
                <form onSubmit={handleSubmit}>
                    <select value={selectedTable} onChange={handleTableChange} required>
                        <option value="">Sélectionner la table</option>
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                    <select value={selectedColumn} onChange={handleColumnChange} required>
                        <option value="">Sélectionner la colonne</option>
                        {columns.map(column => (
                            <option key={column} value={column}>{column}</option>
                        ))}
                    </select>
                    <select value={selectedRow} onChange={handleRowChange} required>
                        <option value="">Sélectionner la ligne</option>
                        {rows.map(row => (
                            <option key={row} value={row}>{row}</option>
                        ))}
                    </select>

                    <select value={actionType} onChange={handleActionTypeChange} required>
                        <option value="">Sélectionner le type d'action</option>
                        <option value="Increase">Increase</option>
                        <option value="Decrease">Decrease</option>
                        <option value="Set">Set</option>
                        <option value="Toggle">Toggle</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Valeur d'action"
                        value={actionValue}
                        onChange={handleActionValueChange}
                        required
                    />
                    <button type="submit">Ajouter le raccourci</button>
                </form>
            </div>
        </div>
    );
};

export default ShortcutManager;
