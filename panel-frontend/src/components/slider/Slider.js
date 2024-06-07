import React from 'react';
import Slider from 'react-slider';
import '../../app/styles/Slider.css';

const SliderComponent = ({ value, onChange, min, max, step, formatLabel }) => {
  return (
    <div className="slider-wrapper">
      <Slider
        className="custom-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        renderThumb={(props, state) => (
            <div {...props} className="custom-thumb">
            </div>
        )}
      />
    </div>
  );
};

export default SliderComponent;