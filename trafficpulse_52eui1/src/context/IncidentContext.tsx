import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Incident, IncidentType, MapMarker, TrafficSignalState } from '../types';
import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type IncidentContextType = {
  incidents: Incident[];
  markers: MapMarker[];
  loading: boolean;
  error: string | null;
  selectedTypes: IncidentType[];
  setSelectedTypes: (types: IncidentType[]) => void;
  reportIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => Promise<void>;
  getTrafficSignalState: (lat: number, lng: number, radius: number) => TrafficSignalState;
  currentLocation: { lat: number; lng: number } | null;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;
};

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const DEFAULT_LOCATION = { lat: 17.385, lng: 78.4867 }; // Hyderabad
const SIGNAL_THRESHOLD = 5; // Number of unique users needed to change signal

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<IncidentType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch incidents from Firestore on component mount
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        // Subscribe to real-time updates
        const incidentsRef = collection(db, 'incidents');
        
        // Create a query to get incidents from the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const q = query(
          incidentsRef,
          orderBy('timestamp', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const incidentList: Incident[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore Timestamp to milliseconds
            const timestamp = data.timestamp instanceof Timestamp 
              ? data.timestamp.toMillis() 
              : Date.now();
              
            incidentList.push({
              id: doc.id,
              type: data.type,
              details: data.details,
              location: data.location,
              userId: data.userId,
              timestamp: timestamp,
              imageUrl: data.imageUrl,
            });
          });
          
          setIncidents(incidentList);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching incidents:", err);
          setError("Failed to load incidents. Please try again later.");
          setLoading(false);
        });
        
        // Clean up subscription on unmount
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up incidents listener:", err);
        setError("Failed to connect to the database. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchIncidents();
  }, []);

  // Process incidents into markers whenever incidents change
  useEffect(() => {
    const processedMarkers: { [key: string]: MapMarker } = {};
    
    incidents.forEach(incident => {
      const roundedLat = Math.round(incident.location.lat * 1000) / 1000;
      const roundedLng = Math.round(incident.location.lng * 1000) / 1000;
      const key = `${roundedLat}-${roundedLng}-${incident.type}`;
      
      if (processedMarkers[key]) {
        processedMarkers[key].count += 1;
      } else {
        processedMarkers[key] = {
          id: key,
          position: { 
            lat: incident.location.lat, 
            lng: incident.location.lng 
          },
          type: incident.type,
          count: 1,
        };
      }
    });
    
    setMarkers(Object.values(processedMarkers));
  }, [incidents]);

  const reportIncident = async (incident: Omit<Incident, 'id' | 'timestamp'>) => {
    try {
      // Create the incident document with Firebase timestamp
      // Remove any undefined values that could cause Firestore errors
      const incidentData = {
        type: incident.type,
        details: incident.details,
        location: incident.location,
        userId: incident.userId,
        timestamp: serverTimestamp(),
      };
      
      // Only add imageUrl if it exists
      if (incident.imageUrl) {
        try {
          const imageUrl = incident.imageUrl;
          
          // If imageUrl is a blob URL, upload the file to Firebase Storage
          if (imageUrl.startsWith('blob:')) {
            // Convert blob URL to File object
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const filename = `incident-images/${incident.userId}-${Date.now()}`;
            const storageRef = ref(storage, filename);
            
            // Upload to Firebase Storage
            await uploadBytes(storageRef, blob);
            
            // Get the public URL
            const downloadUrl = await getDownloadURL(storageRef);
            incidentData.imageUrl = downloadUrl;
          } else {
            incidentData.imageUrl = imageUrl;
          }
        } catch (storageError) {
          console.error("Error processing image:", storageError);
          // If image processing fails, continue without the image
        }
      }
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'incidents'), incidentData);
      
      // We don't need to manually update the state since we're using onSnapshot
      console.log("Incident reported successfully with ID:", docRef.id);
    } catch (err) {
      console.error("Error reporting incident:", err);
      throw new Error("Failed to report incident. Please try again.");
    }
  };

  const getTrafficSignalState = (lat: number, lng: number, radius: number): TrafficSignalState => {
    const state: TrafficSignalState = { red: 0, yellow: 0, green: 0 };
    const uniqueUsers: { [key: string]: Set<string> } = {
      red: new Set(),
      yellow: new Set(),
      green: new Set()
    };
    
    incidents.forEach(incident => {
      const distance = calculateDistance(
        lat, 
        lng, 
        incident.location.lat, 
        incident.location.lng
      );
      
      if (distance <= radius) {
        switch (incident.type) {
          case 'roadfree':
            uniqueUsers.green.add(incident.userId);
            break;
          case 'construction':
            uniqueUsers.yellow.add(incident.userId);
            break;
          case 'accident':
          case 'roadblock':
            uniqueUsers.red.add(incident.userId);
            break;
        }
      }
    });

    state.red = uniqueUsers.red.size;
    state.yellow = uniqueUsers.yellow.size;
    state.green = uniqueUsers.green.size;
    
    return state;
  };

  return (
    <IncidentContext.Provider 
      value={{ 
        incidents, 
        markers, 
        loading,
        error,
        selectedTypes,
        setSelectedTypes,
        reportIncident, 
        getTrafficSignalState, 
        currentLocation,
        setCurrentLocation 
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};