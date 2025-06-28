import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const MainContent: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">TrafficPulse</h1>
        
        <div>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Welcome, {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </header>

      <main>
        {currentUser ? (
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Welcome to TrafficPulse</h2>
            <p className="text-gray-300">
              You are now logged in with email: {currentUser.email}
            </p>
            {/* Your app content goes here */}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Please Sign In to Continue</h2>
            <p className="text-gray-400 mb-6">
              Access your account or create a new one to get started.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
            >
              Sign In / Sign Up
            </button>
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default MainContent;