// @/components/slider/SliderPeriod.js
import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slider';
import '../../app/styles/SliderPeriod.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const dateToValue = (date, startDate, increment) => {
  return Math.round((date - startDate) / increment);
};

const valueToDate = (value, startDate, increment) => {
  const result = new Date(startDate.getTime() + value * increment);
  return result;
};

const SliderPeriod = ({ minDate, maxDate, increment, dateFormat = 'fr-FR' }) => {
  const initialValues = [
    dateToValue(minDate, minDate, increment),
    dateToValue(maxDate, minDate, increment)
  ];

  const [values, setValues] = useState(initialValues);
  const [minDistance, setMinDistance] = useState(1);
  const [isMinCalendarOpen, setIsMinCalendarOpen] = useState(false);
  const [isMaxCalendarOpen, setIsMaxCalendarOpen] = useState(false);
  const minDateRef = useRef();
  const maxDateRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (minDateRef.current && !minDateRef.current.contains(event.target)) &&
        (maxDateRef.current && !maxDateRef.current.contains(event.target))
      ) {
        setIsMinCalendarOpen(false);
        setIsMaxCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const thumbWidth = 50;
    const borderWidth = 0;
    const totalThumbWidth = thumbWidth + 2 * borderWidth;

    const sliderWidth = document.querySelector('.custom-slider').offsetWidth;
    const totalRange = dateToValue(maxDate, minDate, increment);

    const thumbDateIncrement = Math.ceil((totalThumbWidth / sliderWidth) * totalRange);

    setMinDistance(thumbDateIncrement);
  }, [minDate, maxDate, increment]);

  const handleChange = (newValues) => {
    setValues(newValues);
  };

  const handleMinDateChange = (date) => {
    setValues([dateToValue(date, minDate, increment), values[1]]);
    setIsMinCalendarOpen(false);
  };

  const handleMaxDateChange = (date) => {
    setValues([values[0], dateToValue(date, minDate, increment)]);
    setIsMaxCalendarOpen(false);
  };

  return (
    <div className="slider-wrapper">
      <div className="bar-wrapper">
        <button className="bar-button" onClick={() => setIsMinCalendarOpen(!isMinCalendarOpen)}></button>
        <Slider
          className="custom-slider"
          thumbClassName="custom-thumb"
          trackClassName="custom-track"
          value={values}
          onChange={handleChange}
          min={0}
          max={dateToValue(maxDate, minDate, increment)}
          minDistance={minDistance}
          renderThumb={(props, state) => (
            <div {...props} className="custom-thumb">
            </div>
          )}
        />
        <button className="bar-button" onClick={() => setIsMaxCalendarOpen(!isMaxCalendarOpen)}></button>
      </div>
      <div className="date-range">
        <div>{valueToDate(values[0], minDate, increment).toLocaleString(dateFormat)}</div>
        <div>{valueToDate(values[1], minDate, increment).toLocaleString(dateFormat)}</div>
      </div>

      {isMinCalendarOpen && (
        <div ref={minDateRef} className={`calendar-wrapper min-calendar ${isMaxCalendarOpen ? 'two-calendars' : 'one-calendar'}`}>
          <DatePicker
            selected={valueToDate(values[0], minDate, increment)}
            onChange={handleMinDateChange}
            inline
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            useWeekdaysShort
          />
        </div>
      )}

      {isMaxCalendarOpen && (
        <div ref={maxDateRef} className={`calendar-wrapper max-calendar ${isMinCalendarOpen ? 'two-calendars' : 'one-calendar'}`}>
          <DatePicker
            selected={valueToDate(values[1], minDate, increment)}
            onChange={handleMaxDateChange}
            inline
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            useWeekdaysShort
          />
        </div>
      )}
    </div>
  );
};

export default SliderPeriod;
