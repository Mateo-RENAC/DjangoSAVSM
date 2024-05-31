import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import applyScale from '@/utils/applyScale';
import applyColors from '@/utils/applyColors';

const Graph = ({ type, content, title, scale, colors }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const scaledData = applyScale(content, scale);
    const styledData = applyColors(scaledData, colors);

    const data = {
      labels: styledData.map(item => item.label),
      datasets: [{
        label: title,
        data: styledData.map(item => item.value),
        backgroundColor: styledData.map(item => item.color),
        borderColor: styledData.map(item => item.color),
        borderWidth: 1
      }]
    };

    const config = {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [type, content, title, scale, colors]);

  return (
    <div className="graph" style={{ width: '100%', height: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Graph;