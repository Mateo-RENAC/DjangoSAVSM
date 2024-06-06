import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/app/styles/globals.css';

const DateRangeSlider = ({ minDate, maxDate, onDateChange }) => {
  const [isMinDateOpen, setIsMinDateOpen] = useState(false);
  const [isMaxDateOpen, setIsMaxDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(maxDate);

  const minDateRef = useRef(null);
  const maxDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        minDateRef.current &&
        !minDateRef.current.contains(event.target) &&
        !maxDateRef.current.contains(event.target)
      ) {
        setIsMinDateOpen(false);
        setIsMaxDateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSliderChange = ([start, end]) => {
    setStartDate(new Date(start));
    setEndDate(new Date(end));
    onDateChange(new Date(start), new Date(end));
  };

  return (
    <div className="date-range-slider-container">
      <div className="slider-container">
        <button className="circle-button" onClick={() => setIsMinDateOpen(!isMinDateOpen)} />
        <Slider
          className="slider"
          value={[startDate.getTime(), endDate.getTime()]}
          min={minDate.getTime()}
          max={maxDate.getTime()}
          step={24 * 60 * 60 * 1000} // 1 day in milliseconds
          onChange={handleSliderChange}
        />
        <button className="circle-button" onClick={() => setIsMaxDateOpen(!isMaxDateOpen)} />
      </div>
      {isMinDateOpen && (
        <div className="calendar-wrapper" ref={minDateRef}>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              onDateChange(date, endDate);
              setIsMinDateOpen(false);
            }}
            inline
          />
        </div>
      )}
      {isMaxDateOpen && (
        <div className="calendar-wrapper" ref={maxDateRef}>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              onDateChange(startDate, date);
              setIsMaxDateOpen(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSlider;