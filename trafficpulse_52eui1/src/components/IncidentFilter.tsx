import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { IncidentType } from '../types';

const IncidentFilter: React.FC = () => {
  const { selectedTypes, setSelectedTypes } = useIncidents();

  const incidentTypes: { type: IncidentType; label: string; color: string }[] = [
    { type: 'roadfree', label: 'Road Free', color: 'bg-green-500' },
    { type: 'construction', label: 'Construction', color: 'bg-yellow-400' },
    { type: 'accident', label: 'Accident', color: 'bg-red-500' },
    { type: 'roadblock', label: 'Roadblock', color: 'bg-red-500' }
  ];

  const toggleType = (type: IncidentType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="absolute top-20 right-4 bg-gray-800 rounded-lg shadow-lg p-4 z-10">
      <h3 className="text-sm font-semibold mb-2 text-gray-100">Filter Incidents</h3>
      <div className="space-y-2">
        {incidentTypes.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`w-full px-3 py-2 rounded-md transition-all flex items-center space-x-2
              ${selectedTypes.includes(type)
                ? `${color} text-white`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncidentFilter;
