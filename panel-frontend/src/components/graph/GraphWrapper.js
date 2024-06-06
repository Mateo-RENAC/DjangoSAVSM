import React from 'react';
import SimplifiedGraph from './SimplifiedGraph';
import ConfigurableGraph from './ConfigurableGraph';
import HistoryGraph from './HistoryGraph';

const GraphWrapper = ({ type, labels, data, title, colors, config }) => {
  if (config) {
    return <ConfigurableGraph config={config} />;
  }

  if (type === 'line') {
    return <HistoryGraph labels={labels} data={data} title={title} colors={colors} />;
  }

  return <SimplifiedGraph type={type} labels={labels} data={data} title={title} colors={colors} />;
};

export default GraphWrapper;