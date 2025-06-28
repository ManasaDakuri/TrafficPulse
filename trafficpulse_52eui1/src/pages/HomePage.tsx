import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import TrafficSignal from '../components/TrafficSignal';
import { useIncidents } from '../context/IncidentContext';
import IncidentFilter from '../components/IncidentFilter';
import IncidentList from '../components/IncidentList';

const HomePage: React.FC = () => {
  const { isAuthenticated, hasActiveReport, theme } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentLocation, getTrafficSignalState } = useIncidents();
  
  const signalState = currentLocation 
    ? getTrafficSignalState(currentLocation.lat, currentLocation.lng, 2)
    : { red: 0, yellow: 0, green: 0 };

  const handleReportClick = () => {
    if (isAuthenticated) {
      if (hasActiveReport) {
        alert('You already have an active incident report. Please wait before submitting another one.');
        return;
      }
      navigate('/report');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleReportClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg transition-colors flex items-center"
          >
            Report Incident
          </button>
        </div>
        
        <div className="absolute top-4 left-4 z-10">
          <TrafficSignal state={signalState} className="shadow-lg bg-gray-800" />
        </div>
        
        <IncidentFilter />
        
        <div className="h-[60vh] md:h-[70vh] relative">
          <Map />
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <IncidentList />
        </div>
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
