import React from 'react';
import Graphs from '../components/Graphs';

const Home = () => {
  const sampleData1 = [
    { name: 'January', value: 65 },
    { name: 'February', value: 59 },
    { name: 'March', value: 80 },
    { name: 'April', value: 81 },
    { name: 'May', value: 56 },
    { name: 'June', value: 55 },
    { name: 'July', value: 40 },
  ];

  const sampleData2 = [
    { name: 'August', value: 75 },
    { name: 'September', value: 69 },
    { name: 'October', value: 90 },
    { name: 'November', value: 91 },
    { name: 'December', value: 66 },
  ];

  const graphs = [
    { data: sampleData1, row: 0, column: 0, widthWeight: 2, heightWeight: 1 },
    { data: sampleData1, row: 0, column: 2, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 0, column: 3, widthWeight: 1, heightWeight: 1 },

    { data: sampleData1, row: 1, column: 0, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 1, column: 1, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 1, column: 2, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 1, column: 3, widthWeight: 1, heightWeight: 1 },

    { data: sampleData1, row: 2, column: 0, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 2, column: 1, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 2, column: 2, widthWeight: 2, heightWeight: 1 },
    { data: sampleData1, row: 2, column: 3, widthWeight: 1, heightWeight: 1 },

    { data: sampleData1, row: 3, column: 0, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 3, column: 1, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 3, column: 2, widthWeight: 1, heightWeight: 1 },
    { data: sampleData1, row: 3, column: 3, widthWeight: 1, heightWeight: 1 },
  ];

  return (
    <div className="page-container">
      <header className="header">
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
      </header>
      <div className="graphs-container">
        <Graphs rows={4} columns={4} graphs={graphs} />
      </div>
    </div>
  );
};

export default Home;