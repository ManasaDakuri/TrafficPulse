import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // If not authenticated and menu is being opened, show auth modal
    if (!isAuthenticated && !isMenuOpen) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar 
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
      />
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
