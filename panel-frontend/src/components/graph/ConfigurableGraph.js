import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const ConfigurableGraph = ({ config }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [config]);

  return (
    <div className="graph" style={{ width: '100%', height: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ConfigurableGraph;