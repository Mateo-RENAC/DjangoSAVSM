import React from 'react';
import Slider from 'react-slider';
import './SliderComponent.css';

const SliderComponent = ({ value, onChange }) => {
  return (
    <div className="slider-wrapper">
      <Slider
        className="custom-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        value={value}
        onChange={onChange}
        min={0}
        max={100}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};

export default SliderComponent;
