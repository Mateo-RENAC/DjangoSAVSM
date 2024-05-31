import React, { useState } from 'react';
import GraphContainer from './GraphContainer';
import Title from './Title';

const DashboardContainer = ({ graphs, settings }) => {
  const [hiddenGraphs, setHiddenGraphs] = useState([]);

  const toggleGraphVisibility = (index) => {
    setHiddenGraphs(prevState =>
      prevState.includes(index)
        ? prevState.filter(i => i !== index)
        : [...prevState, index]
    );
  };

  const { gap } = settings;

  return (
    <div className="dashboard-container" style={{ width: settings.width }}>
      <Title text={settings.title} />
      <div className="taskbar" style={{ display: 'flex', marginBottom: '10px' }}>
        {graphs.map((graph, index) => hiddenGraphs.includes(index) && (
          <button
            key={index}
            onClick={() => toggleGraphVisibility(index)}
            style={{
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              padding: '5px 10px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            Show {graph.title}
          </button>
        ))}
      </div>
      <div className="graphs-grid" style={{ gap }}>
        {graphs.map((graph, index) => (
          <GraphContainer
            key={index}
            graph={graph}
            isVisible={!hiddenGraphs.includes(index)}
            onToggleVisibility={() => toggleGraphVisibility(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardContainer;