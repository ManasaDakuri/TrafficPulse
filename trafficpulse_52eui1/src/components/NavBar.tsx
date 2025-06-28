import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type NavBarProps = {
  toggleMenu: () => void;
  isMenuOpen: boolean;
};

const NavBar: React.FC<NavBarProps> = ({ toggleMenu, isMenuOpen }) => {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={`fixed top-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm shadow-sm z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-500" />
            <span className={`ml-2 text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              TrafficPulse
            </span>
            <button
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600" />
              ) : (
                <Sun className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Welcome, {user?.username}
                </span>
                <button 
                  onClick={logout}
                  className={`${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  } flex items-center`}
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => toggleMenu()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Welcome, {user?.username}
                </div>
                <button 
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className={`${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  } flex items-center px-3 py-2`}
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => toggleMenu()}
                className="bg-blue-500 hover:bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
