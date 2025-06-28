export type User = {
  id?: string;
  email: string;
  username: string;
};

export type IncidentType = 'roadfree' | 'accident' | 'roadblock' | 'construction';

export type Incident = {
  id?: string;
  type: IncidentType;
  details: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  userId: string;
  timestamp: number;
  imageUrl?: string;
};

export type MapMarker = {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  type: IncidentType;
  count: number;
};

export type TrafficSignalState = {
  red: number;
  yellow: number;
  green: number;
};
