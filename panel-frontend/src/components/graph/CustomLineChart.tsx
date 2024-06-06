import React from 'react';
import { Line } from 'react-chartjs-2';

const CustomLineChart = ({ data, title, colors }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      label: title,
      data: data.map(item => item.value),
      borderColor: colors[0],
      backgroundColor: colors[0],
      fill: false,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default CustomLineChart;