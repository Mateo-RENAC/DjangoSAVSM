import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/graph/DashboardContainer';

const GraphBoard = () => {
  const [graphs, setGraphs] = useState([]);
  const settings = {
    width: '100%',
    title: 'Customizable Dashboard',
    numberOfColumns: 5,
    gap: '4px' // Set the gap between graph containers
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await fetch('http://localhost:8000/panel/api/stock/');
        const consumptionResponse = await fetch('http://localhost:8000/panel/api/consumption/');
        const stockHistoryResponse = await fetch('http://localhost:8000/panel/api/stock-history/');
        const consumptionHistoryResponse = await fetch('http://localhost:8000/panel/api/consumption-history/');

        const stockData = await stockResponse.json();
        const consumptionData = await consumptionResponse.json();
        const stockHistoryData = await stockHistoryResponse.json();
        const consumptionHistoryData = await consumptionHistoryResponse.json();

        const stockGraph = {
          type: 'bar',
          labels: stockData.map(item => item.product),
          data: stockData.map(item => ({ label: item.product, values: [item.count] })),
          title: 'Stock Bar Chart',
          colors: ['#29675e'],
        };

        const consumptionGraph = {
          type: 'bar',
          labels: consumptionData.map(item => item.product),
          data: consumptionData.map(item => ({ label: item.product, values: [item.count] })),
          title: 'Consumption Bar Chart',
          colors: ['#4f1d65'],
        };

        const stockHistoryGraph = {
          type: 'line',
          labels: stockHistoryData.map(item => item.date.split('T')[0]),
          data: stockHistoryData.map(item => ({ label: item.product, values: [item.count] })),
          title: 'Stock History Curve',
          colors: ['#8c3d4e'],
        };

        const consumptionHistoryGraph = {
          type: 'line',
          labels: consumptionHistoryData.map(item => item.date.split('T')[0]),
          data: consumptionHistoryData.map(item => ({ label: item.product, values: [item.count] })),
          title: 'Consumption History Curve',
          colors: ['#36759e'],
        };

        setGraphs([stockGraph, consumptionGraph, stockHistoryGraph, consumptionHistoryGraph]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <DashboardContainer graphs={graphs} settings={settings} />
    </div>
  );
};

export default GraphBoard;
