import React, { useEffect, useState } from 'react';
import { TrafficSignalState } from '../types';

type TrafficSignalProps = {
  state: TrafficSignalState;
  className?: string;
};

const TrafficSignal: React.FC<TrafficSignalProps> = ({ state, className = '' }) => {
  const [activeLight, setActiveLight] = useState<'red' | 'yellow' | 'green'>('green');
  
  // Determine which light should be active based on the signal state
  useEffect(() => {
    // Default to green if no reports
    if (state.red === 0 && state.yellow === 0 && state.green === 0) {
      setActiveLight('green');
      return;
    }
    
    // Prioritize red incidents (accident and roadblock)
    if (state.red >= 6) {
      setActiveLight('red');
      return;
    }
    
    // Then prioritize yellow incidents (construction)
    if (state.yellow >= 6) {
      setActiveLight('yellow');
      return;
    }
    
    // Finally, check for green incidents (roadfree)
    if (state.green >= 6) {
      setActiveLight('green');
      return;
    }
    
    // If none of the thresholds are met, default to green
    setActiveLight('green');
  }, [state]);

  return (
    <div className={`flex flex-col items-center p-4 bg-gray-800 rounded-lg ${className}`}>
      <div 
        className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center ${
          activeLight === 'red' 
            ? 'bg-red-500 ring-4 ring-red-300 animate-pulse' 
            : 'bg-red-900'
        }`}
      >
        {state.red > 0 && (
          <span className="text-white font-bold">{state.red}</span>
        )}
      </div>
      
      <div 
        className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center ${
          activeLight === 'yellow' 
            ? 'bg-yellow-400 ring-4 ring-yellow-200 animate-pulse' 
            : 'bg-yellow-900'
        }`}
      >
        {state.yellow > 0 && (
          <span className="text-white font-bold">{state.yellow}</span>
        )}
      </div>
      
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          activeLight === 'green' 
            ? 'bg-green-500 ring-4 ring-green-300 animate-pulse' 
            : 'bg-green-900'
        }`}
      >
        {state.green > 0 && (
          <span className="text-white font-bold">{state.green}</span>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-white text-sm font-medium">
          {activeLight === 'red' && 'High Alert'}
          {activeLight === 'yellow' && 'Caution'}
          {activeLight === 'green' && 'Clear Roads'}
        </p>
        <p className="text-gray-300 text-xs mt-1">
          Based on {state.red + state.yellow + state.green} reports
        </p>
      </div>
    </div>
  );
};

export default TrafficSignal;
