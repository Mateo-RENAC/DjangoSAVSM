import React from 'react';

const ResizeHandle = ({ onResize }) => {
  const handleResize = (e) => {
    const newSize = { width: e.target.offsetWidth, height: e.target.offsetHeight };
    onResize(newSize);
  };

  return <div className="resize-handle" onMouseUp={handleResize} />;
};

export default ResizeHandle;