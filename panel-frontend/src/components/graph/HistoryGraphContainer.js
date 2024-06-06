import React, { useState, useEffect, useRef } from 'react';
import GraphWrapper from './GraphWrapper';
import ShowHideButton from './ShowHideButton';
import { ResizableBox } from 'react-resizable';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import 'react-resizable/css/styles.css';
import DateRangeSlider from '../DateRangeSlider';

const HistoryGraphContainer = ({ graph, isVisible, onToggleVisibility, gap }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [minSize, setMinSize] = useState({ minWidth: 150, minHeight: 150 });
  const [minDate, setMinDate] = useState(new Date('2020-01-01'));
  const [maxDate, setMaxDate] = useState(new Date());
  const [interval, setInterval] = useState('day');
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

      const newMinHeight = 150 + legendHeight + titleHeight;
      const newMinWidth = 150 + Math.max(labelWidth + labelPadding, maxLabelWidth);
      setMinSize({ minWidth: newMinWidth, minHeight: newMinHeight });
    }
  }, [graph]);

  const handleWheel = (event) => {
    if (event.shiftKey) {
      setZoomLevel(prevZoom => Math.max(0.5, Math.min(2, prevZoom + event.deltaY * -0.01)));
    }
  };

  const handleDateChange = (start, end) => {
    setMinDate(start);
    setMaxDate(end);
    // Apply your data filtering logic here based on start and end dates
  };

  return (
    <div style={{ display: isVisible ? 'block' : 'none', margin: gap }}>
      <ResizableBox
        width={300}
        height={300}
        minConstraints={[minSize.minWidth, minSize.minHeight]}
        maxConstraints={[600, 600]}
        resizeHandles={['se']}
      >
        <div ref={graphRef} style={{ width: '100%', height: '100%', position: 'relative', border: '1px solid #ccc', overflow: 'hidden' }}>
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
                fontSize: '16px',
                color: '#fff'
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
                fontSize: '16px',
                color: '#fff'
              }}
              onClick={() => setZoomLevel(prevZoom => Math.max(0.5, prevZoom - 0.1))}
            >
              <FaSearchMinus />
            </button>
          </div>
          <div className="date-range-picker" style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <DateRangeSlider minDate={minDate} maxDate={maxDate} onDateChange={handleDateChange} />
          </div>*/
        </div>
      </ResizableBox>
    </div>
  );
};

export default HistoryGraphContainer;