import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

type ThemeType = 'light' | 'dark';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  hasActiveReport: boolean;
  setHasActiveReport: (value: boolean) => void;
  theme: ThemeType;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasActiveReport, setHasActiveReport] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setHasActiveReport(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setHasActiveReport(false);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser) {
        // Use the imported updateProfile function instead of auth.currentUser?.updateProfile
        await updateProfile(firebaseUser, {
          displayName: username
        });
        
        setUser({
          id: firebaseUser.uid,
          email: email,
          username: username,
        });
        setHasActiveReport(false);
      } else {
        throw new Error("User credential missing");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw new Error(`Signup failed: ${error.message}`);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setHasActiveReport(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        hasActiveReport,
        setHasActiveReport,
        theme,
        toggleTheme,
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};