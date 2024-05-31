import React from 'react';
import DashboardContainer from '../components/graph/DashboardContainer';
import Breadcrumb from "@/components/Breadcrumb";

const sampleGraphs = [
  { type: 'line', content: [{ label: 'Jan', value: 30 }, { label: 'Feb', value: 20 }, { label: 'Mar', value: 50 }], title: 'Line Chart', scale: 1, colors: ['#29675e'], weight: 1 },
  { type: 'bar', content: [{ label: 'A', value: 12 }, { label: 'B', value: 19 }, { label: 'C', value: 3 }], title: 'Bar Chart', scale: 1, colors: ['#4f1d65'], weight: 2 },
  { type: 'pie', content: [{ label: 'Red', value: 10 }, { label: 'Blue', value: 20 }, { label: 'Yellow', value: 30 }], title: 'Pie Chart', scale: 1, colors: ['#8c3d4e', '#36759e', '#9d802b'], weight: 1 },
  { type: 'bar', content: [{ label: 'A', value: 12 }, { label: 'B', value: 19 }, { label: 'C', value: 3 }], title: 'Bar Chart', scale: 1, colors: ['#0b7a9f'], weight: 20 },
  { type: 'bar', content: [{ label: 'A', value: 56 }, { label: 'B', value: 19 }, { label: 'C', value: 90 }], title: 'Bar Chart', scale: 1, colors: ['#257f25'], weight: 20 },
  { type: 'bar', content: [{ label: 'A', value: 12 }, { label: 'B', value: 72 }, { label: 'C', value: 3 }], title: 'Bar Chart', scale: 1, colors: ['#651717'], weight: 20 },
  { type: 'bar', content: [{ label: 'A', value: 36 }, { label: 'B', value: 19 }, { label: 'C', value: 3 }], title: 'Bar Chart', scale: 1, colors: ['#935724'], weight: 20 },
  { type: 'line', content: [{ label: 'Jan', value: 30 }, { label: 'Feb', value: 20 }, { label: 'Mar', value: 50 }], title: 'Line Chart', scale: 1, colors: ['#3b2967'], weight: 1 },
  { type: 'pie', content: [{ label: 'Red', value: 10 }, { label: 'Blue', value: 20 }, { label: 'Yellow', value: 30 }], title: 'Pie Chart', scale: 1, colors: ['#8c3d4e', '#36759e', '#9d802b'], weight: 1 },
  { type: 'radar', content: [{ label: 'Red', value: 10 }, { label: 'Blue', value: 20 }, { label: 'Yellow', value: 30 }], title: 'Pie Chart', scale: 1, colors: ['#8c3d4e', '#36759e', '#9d802b'], weight: 1 },

];

const settings = {
  width: '100%',
  title: 'Customizable Dashboard',
  numberOfColumns: 5,
  gap: '4px' // Set the gap between graph containers
};

const GraphBoard = () => {
  return (
    <div className="app">
      <DashboardContainer graphs={sampleGraphs} settings={settings} />
    </div>
  );
};

export default GraphBoard;
