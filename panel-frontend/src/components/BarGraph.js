import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ data, width = '100%', height = '400px' }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Values',
        data: data.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // This helps to manage responsiveness
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Graph Example',
      },
    },
  };

  return (
    <div style={{ width, height }}> {/* Use the passed width and height props */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarGraph;