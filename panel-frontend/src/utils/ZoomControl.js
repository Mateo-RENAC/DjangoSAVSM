import React from 'react';

const ZoomControl = ({ zoomLevel, onZoomChange }) => {
  return (
    <div className="zoom-control">
      <button onClick={() => onZoomChange(zoomLevel + 0.1)}>Zoom In</button>
      <button onClick={() => onZoomChange(zoomLevel - 0.1)}>Zoom Out</button>
    </div>
  );
};

export default ZoomControl;