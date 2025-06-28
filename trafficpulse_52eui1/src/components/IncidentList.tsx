import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { formatDistanceToNow } from 'date-fns';

const IncidentList: React.FC = () => {
  const { incidents } = useIncidents();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Reports</h2>
      <div className="incident-list">
        {incidents.sort((a, b) => b.timestamp - a.timestamp).map((incident) => (
          <div
            key={incident.id}
            className="bg-gray-700 rounded-lg p-4 mb-3 animate-fade-in"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-100 capitalize">{incident.type}</h3>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(incident.timestamp, { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-2">{incident.details}</p>
            {incident.location.address && (
              <p className="text-gray-400 text-sm mt-1">{incident.location.address}</p>
            )}
            {incident.imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden w-36 h-36">
                <img
                  src={incident.imageUrl}
                  alt="Incident"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentList;
