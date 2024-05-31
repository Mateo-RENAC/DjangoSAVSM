import React from 'react';
import BarGraph from './BarGraph';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 0px;
  width: 100%;
  height: 100%;
`;

const GraphContainer = styled.div`
  grid-column: span ${({ widthWeight }) => widthWeight};
  grid-row: span ${({ heightWeight }) => heightWeight};
`;

const Graphs = ({ graphs, rows, columns }) => {
  const calculateGridTemplateRows = () => {
    if (rows) {
      return `repeat(${rows}, 1fr)`;
    }
    return 'auto';
  };

  return (
    <GridContainer columns={columns}>
      {graphs.map((graph, index) => (
        <GraphContainer
          key={index}
          widthWeight={graph.widthWeight}
          heightWeight={graph.heightWeight}
        >
          <BarGraph data={graph.data} />
        </GraphContainer>
      ))}
    </GridContainer>
  );
};

export default Graphs;
