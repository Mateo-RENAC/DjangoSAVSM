import React, { useState, useEffect, useRef } from 'react';
import GraphWrapper from './GraphWrapper';
import ShowHideButton from './ShowHideButton';
import SliderInterval from '../slider/Slider';
import SliderPeriod from '../slider/SliderPeriod';
import { ResizableBox } from 'react-resizable';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import 'react-resizable/css/styles.css';

const HistoryGraphContainer = ({ graph, isVisible, onToggleVisibility, gap }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [minSize, setMinSize] = useState({ minWidth: 150, minHeight: 250 }); // Increased minimum height to ensure both sliders visibility
  const [interval, setInterval] = useState(60 * 60 * 1000); // Default interval: 1 hour in milliseconds
  const [minDate, setMinDate] = useState(new Date('2020-01-01'));
  const [maxDate, setMaxDate] = useState(new Date());
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current) {
      const legend = graphRef.current.querySelector('.chartjs-legend');
      const titleHeight = graphRef.current.querySelector('.chartjs-title')?.offsetHeight || 0;
      const legendHeight = legend?.offsetHeight || 0;
      const legendItems = legend ? Array.from(legend.querySelectorAll('li')) : [];

      let leftmostLegendItem = { left: Infinity };
      legendItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.left < leftmostLegendItem.left) {
          leftmostLegendItem = item;
        }
      });

      const colorBoxWidth = leftmostLegendItem.querySelector ? leftmostLegendItem.querySelector('span')?.offsetWidth || 0 : 0;
      const labelWidth = leftmostLegendItem.offsetWidth ? leftmostLegendItem.offsetWidth + colorBoxWidth : 0;
      const labelPadding = 40; // padding around the label and color box

      const xAxisLabels = Array.from(graphRef.current.querySelectorAll('.chartjs-x-axis text'));
      const maxLabelWidth = xAxisLabels.reduce((maxWidth, label) => Math.max(maxWidth, label.offsetWidth), 0);

      const newMinHeight = 250 + legendHeight + titleHeight; // Increased minimum height
      const newMinWidth = 150 + Math.max(labelWidth + labelPadding, maxLabelWidth);
      setMinSize({ minWidth: newMinWidth, minHeight: newMinHeight });
    }
  }, [graph]);

  const handleWheel = (event) => {
    if (event.shiftKey) {
      setZoomLevel(prevZoom => Math.max(0.5, Math.min(2, prevZoom + event.deltaY * -0.01)));
    }
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(fractionToInterval(newInterval / 100));
    // Apply your data filtering logic here based on the new interval
  };

  const handleDateChange = (start, end) => {
    setMinDate(start);
    setMaxDate(end);
    // Apply your data filtering logic here based on start and end dates
  };

  const intervalToFraction = (value) => {
    if (value < 24 * 60 * 60 * 1000) { // Hours range
      return (value - 1) / (23 * 60 * 60 * 1000) * (2 / 6);
    } else if (value < 31 * 24 * 60 * 60 * 1000) { // Days range
      return 2 / 6 + (value - 24 * 60 * 60 * 1000) / (30 * 24 * 60 * 60 * 1000) * (3 / 6);
    } else { // Months range
      return 5 / 6 + (value - 31 * 24 * 60 * 60 * 1000) / (11 * 30 * 24 * 60 * 60 * 1000) * (1 / 6);
    }
  };

  const fractionToInterval = (fraction) => {
    if (fraction < 2 / 6) { // Hours range
      return 1 + fraction / (2 / 6) * (23 * 60 * 60 * 1000);
    } else if (fraction < 5 / 6) { // Days range
      return 24 * 60 * 60 * 1000 + (fraction - 2 / 6) / (3 / 6) * (30 * 24 * 60 * 60 * 1000);
    } else { // Months range
      return 31 * 24 * 60 * 60 * 1000 + (fraction - 5 / 6) / (1 / 6) * (11 * 30 * 24 * 60 * 60 * 1000);
    }
  };

  const formatIntervalLabel = (value) => {
    if (value < 24 * 60 * 60 * 1000) {
      return `${Math.floor(value / (60 * 60 * 1000))}h`;
    } else if (value < 31 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(value / (24 * 60 * 60 * 1000))}d`;
    } else {
      return `${Math.floor(value / (30 * 24 * 60 * 60 * 1000))}m`;
    }
  };

  const getIntervalStep = (value) => {
    if (value < 24 * 60 * 60 * 1000) {
      return 60 * 60 * 1000; // 1 hour step
    } else if (value < 31 * 24 * 60 * 60 * 1000) {
      return 24 * 60 * 60 * 1000; // 1 day step
    } else {
      return 30 * 24 * 60 * 60 * 1000; // 1 month step
    }
  };

  return (
    <div style={{ display: isVisible ? 'block' : 'none', margin: gap }}>
      <ResizableBox
        width={300}
        height={450} // Adjusted height to provide space for both sliders
        minConstraints={[minSize.minWidth, minSize.minHeight + 150]} // Extra space for sliders
        maxConstraints={[600, 600]}
        resizeHandles={['se']}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div ref={graphRef} style={{ flex: '1 1 auto', position: 'relative', borderBottom: '1px solid #ccc', minHeight: '0' }}>
            <div style={{ width: '100%', height: '100%', zoom: zoomLevel }} onWheel={handleWheel}>
              <GraphWrapper {...graph} />
            </div>
            <ShowHideButton onClick={onToggleVisibility} visible={isVisible} />
            <div className="zoom-buttons" style={{ position: 'absolute', top: '5px', left: '5px', display: 'flex', gap: '5px' }}>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => setZoomLevel(prevZoom => Math.min(2, prevZoom + 0.1))}
              >
                <FaSearchPlus />
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => setZoomLevel(prevZoom => Math.max(0.5, prevZoom - 0.1))}
              >
                <FaSearchMinus />
              </button>
            </div>
          </div>
          <div style={{ flex: '0 0 50px', padding: '5px', boxSizing: 'border-box' }}>
            <SliderInterval
              value={intervalToFraction(interval) * 100} // Assuming the slider value is between 0 and 100
              min={0}
              max={100}
              step={1}
              formatLabel={formatIntervalLabel}
              onChange={handleIntervalChange}
            />
            <div className="slider-value">{formatIntervalLabel(interval)}</div>
          </div>
          <div style={{ flex: '0 0 50px', padding: '5px', boxSizing: 'border-box' }}>
            <SliderPeriod
              minDate={minDate}
              maxDate={maxDate}
              increment={24 * 60 * 60 * 1000} // 1 day
              onDateChange={handleDateChange}
            />
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default HistoryGraphContainer;
