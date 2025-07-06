import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ProtocolStats } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProtocolChartProps {
  protocols: ProtocolStats[];
}

const ProtocolChart: React.FC<ProtocolChartProps> = ({ protocols }) => {
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#84cc16',
    '#f97316',
  ];

  const data = {
    labels: protocols.map(p => p.protocol),
    datasets: [
      {
        data: protocols.map(p => p.buyCount + p.sellCount),
        backgroundColor: colors.slice(0, protocols.length),
        borderColor: colors.slice(0, protocols.length).map(c => c + '80'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9ca3af',
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProtocolChart; 