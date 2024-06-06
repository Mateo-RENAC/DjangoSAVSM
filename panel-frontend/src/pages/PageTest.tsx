import React from 'react';
import SliderPeriod from '../components/slider/SliderPeriod';

const TestPage = () => {
  const minDate = new Date('2023-01-01');
  const maxDate = new Date('2023-12-31');
  const increment = 24 * 60 * 60 * 1000; // One day in milliseconds

  return (
    <div>
      <h1>Slider Period Test Page</h1>
      <SliderPeriod minDate={minDate} maxDate={maxDate} increment={increment} />
    </div>
  );
};

export default TestPage;