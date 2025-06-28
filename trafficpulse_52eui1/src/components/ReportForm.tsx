import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import { IncidentType } from '../types';

const ReportForm: React.FC = () => {
  const { user, setHasActiveReport } = useAuth();
  const { reportIncident, currentLocation } = useIncidents();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [details, setDetails] = useState('');
  const [type, setType] = useState<IncidentType>('roadfree');
  const [location, setLocation] = useState(currentLocation || { lat: 0, lng: 0 });
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleTypeSelection = (selectedType: IncidentType) => {
    setType(selectedType);
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAddress('Current Location');
        },
        (error) => {
          setError(`Error detecting location: ${error.message}`);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resizeImage(file, 800, 600, (resizedFile: File | null) => {
        if (resizedFile) {
          setImage(resizedFile);
          setPreviewImage(URL.createObjectURL(resizedFile));
        } else {
          setError('Error resizing image');
        }
      });
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number, callback: (file: File | null) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            callback(resizedFile);
          } else {
            callback(null);
          }
        }, file.type);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!user?.id) {
        throw new Error('You must be logged in to report an incident');
      }
      
      if (!location.lat || !location.lng) {
        throw new Error('Please provide a valid location');
      }
      
      // Only include imageUrl if an image is selected
      const imageUrl = image ? URL.createObjectURL(image) : null;
      
      await reportIncident({
        type,
        details,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: address || undefined,
        },
        userId: user.id,
        // Only include imageUrl if it's not null
        ...(imageUrl && { imageUrl }),
      });
      
      setHasActiveReport(true);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error("Error in handleSubmit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions: { value: IncidentType; label: string; color: string }[] = [
    { value: 'roadfree', label: 'Road Free', color: 'bg-green-500' },
    { value: 'accident', label: 'Accident', color: 'bg-red-500' },
    { value: 'roadblock', label: 'Roadblock', color: 'bg-red-500' },
    { value: 'construction', label: 'Construction', color: 'bg-yellow-400' },
  ];

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Thank You!</h2>
          <p className="text-gray-300 mb-4">
            Your incident report has been submitted successfully.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Report Traffic Incident</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Incident Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTypeSelection(option.value)}
              className={`p-3 rounded-md flex items-center justify-center transition-colors ${
                type === option.value
                  ? `${option.color} text-white ring-2 ring-offset-2 ring-${option.color.replace('bg-', '')}`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">
          Add Details
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the incident..."
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location
        </label>
        <div className="flex">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter address or use current location"
          />
          <button
            type="button"
            onClick={handleLocationDetection}
            className="bg-blue-600/20 text-blue-400 px-3 py-2 rounded-r-md border border-l-0 border-gray-600 hover:bg-blue-600/30 transition-colors"
          >
            <MapPin className="h-5 w-5" />
          </button>
        </div>
        {location.lat !== 0 && location.lng !== 0 && (
          <p className="mt-1 text-xs text-gray-400">
            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload Image (Optional)
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 rounded-md border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-600">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-400">
              {image ? image.name : 'Click to upload an image'}
            </span>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 rounded-md w-24 h-24 object-cover"
              />
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              ref={imageInputRef}
            />
          </label>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
          isSubmitting 
            ? 'bg-blue-600/50 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        } transition-colors`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default ReportForm;