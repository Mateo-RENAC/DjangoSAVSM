import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const SimplifiedGraph = ({ type, labels, data = [], title, colors = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const chartData = {
      labels: labels,
      datasets: type === 'bar'
        ? data.map((dataset, index) => ({
            label: dataset.label || `Dataset ${index + 1}`,
            data: dataset.values || [],
            backgroundColor: colors[index % colors.length] || 'rgba(0,0,0,0.1)',
            borderColor: colors[index % colors.length] || 'rgba(0,0,0,0.1)',
            borderWidth: 1,
          }))
        : data.map((dataset, index) => ({
            label: dataset.label || `Dataset ${index + 1}`,
            data: dataset.values || [],
            backgroundColor: colors[index % colors.length] || 'rgba(0,0,0,0.1)',
            borderColor: colors[index % colors.length] || 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            fill: false,
          })),
    };

    const config = {
      type: type,
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
  }, [type, labels, data, title, colors]);

  return (
    <div className="graph" style={{ width: '100%', height: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SimplifiedGraph;