import React from 'react';

const ShortcutButton = ({ label, action }) => {
    return (
        <button onClick={action}>
            {label}
        </button>
    );
};

export default ShortcutButton;
