import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HistoryGraph = ({ labels, data, title, colors }) => {
  const chartRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date(labels[0]));
  const [endDate, setEndDate] = useState(new Date(labels[labels.length - 1]));
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const filteredData = data.map(dataset => {
      let currentValue = null;
      const values = labels.map(label => {
        if (new Date(label) >= startDate && new Date(label) <= endDate) {
          currentValue = dataset.values[labels.indexOf(label)] || currentValue;
          return currentValue;
        }
        return null;
      }).filter(value => value !== null);
      return { ...dataset, values };
    });

    const chartData = {
      labels: labels.filter(label => new Date(label) >= startDate && new Date(label) <= endDate),
      datasets: filteredData.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.values,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1,
        fill: false,
      })),
    };

    const config = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
          }
        }
      }
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [labels, data, title, colors, startDate, endDate]);

  const formatLabel = label => {
    const [date, time] = label.split('T');
    return `${date}\n${time}`;
  };

  return (
    <div className="graph" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={chartRef}></canvas>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsStartOpen(!isStartOpen)}>Start Date</button>
        {isStartOpen && <DatePicker selected={startDate} onChange={date => setStartDate(date)} inline />}
        <button onClick={() => setIsEndOpen(!isEndOpen)}>End Date</button>
        {isEndOpen && <DatePicker selected={endDate} onChange={date => setEndDate(date)} inline />}
      </div>
    </div>
  );
};

export default HistoryGraph;
