import React, { useState, useEffect } from 'react';

const ShortcutManager = () => {
    const [name, setName] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [columnType, setColumnType] = useState('');

    useEffect(() => {
        // Récupérer la liste des tables lorsque le composant est monté
        fetch('http://localhost:8000/panel/get_table_list/')
            .then(response => response.json())
            .then(data => {
                setTables(data.tables);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleTableChange = (event) => {
        const selectedTable = event.target.value;
        setSelectedTable(selectedTable);
        // Réinitialiser la liste des colonnes et le type de colonne sélectionné
        setColumns([]);
        setSelectedColumn('');
        setColumnType('');

        // Récupérer la liste des colonnes pour la table sélectionnée
        if (selectedTable) {
            fetch(`http://localhost:8000/panel/get_column_list/?table_name=${selectedTable}`)
                .then(response => response.json())
                .then(data => {
                    setColumns(data.columns || []);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setColumns([]); // Set columns to an empty array if the fetch fails
                });
        }
    };

    const handleColumnChange = (event) => {
        const selectedColumn = event.target.value;
        setSelectedColumn(selectedColumn);

        // Appel à la vue Django pour récupérer le type de colonne
        fetch(`http://localhost:8000/panel/get_column_type/?table_name=${selectedTable}&column_name=${selectedColumn}`)
            .then(response => response.json())
            .then(data => {
                setColumnType(data.column_type);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <h1>Gestionnaire de Raccourcis</h1>
            <div>
                <h2>Créer un nouveau raccourci</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Logique pour créer le raccourci
                }}>
                    <input
                        type="text"
                        placeholder="Nom du raccourci"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <select value={selectedTable} onChange={handleTableChange} required>
                        <option value="">Sélectionner la table</option>
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                    <select value={selectedColumn} onChange={handleColumnChange} required>
                        <option value="">Sélectionner la colonne</option>
                        {Array.isArray(columns) && columns.map(column => (
                            <option key={column} value={column}>{column}</option>
                        ))}
                    </select>
                    {columnType && (
                        <p>Type de colonne : {columnType}</p>
                    )}
                    <button type="submit">Ajouter le raccourci</button>
                </form>
            </div>
        </div>
    );
};

export default ShortcutManager;
