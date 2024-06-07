import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ShowHideButton = ({ onClick, visible }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
      }}
    >
      {visible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
};

export default ShowHideButton;