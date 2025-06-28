import React from 'react';
import { Tooltip } from 'react-tooltip';

const MapLegend: React.FC = () => {
  const legendItems = [
    { type: 'Road Free', color: 'bg-green-500', description: '8+ reports for clear roads' },
    { type: 'Construction', color: 'bg-yellow-400', description: '8+ reports for ongoing construction' },
    { type: 'Accident', color: 'bg-red-500', description: '8+ reports for accidents' },
    { type: 'Roadblock', color: 'bg-red-500', description: '8+ reports for road blockages' }
  ];

  return (
    <div className="absolute bottom-4 left-4 map-legend z-10">
      <h3 className="text-sm font-semibold mb-2 text-gray-100">Map Legend</h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2"
            data-tooltip-id={`legend-${index}`}
            data-tooltip-content={item.description}
          >
            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
            <span className="text-sm text-gray-300">{item.type}</span>
            <Tooltip id={`legend-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
