import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import TrafficSignal from '../components/TrafficSignal';
import { useIncidents } from '../context/IncidentContext';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation, getTrafficSignalState } = useIncidents();
  
  const signalState = currentLocation 
    ? getTrafficSignalState(currentLocation.lat, currentLocation.lng, 2)
    : { red: 0, yellow: 0, green: 0 };

  return (
    <div className="min-h-screen bg-gray-900 pt-6 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-300 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Map
        </button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-100 mb-6 text-center">
              Current Traffic Conditions
            </h2>
            <TrafficSignal state={signalState} className="shadow-lg" />
            <p className="mt-6 text-sm text-gray-400 text-center max-w-xs">
              Traffic signal reflects current conditions based on user reports in your area. Your report will help keep this data accurate.
            </p>
          </div>
          
          <div>
            <ReportForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
