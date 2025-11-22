import React, { createContext, useContext, useState, useCallback } from 'react';
import parkingService from '../services/parkingService';
import parkingLotService from '../services/parkingLotService';

const ParkingContext = createContext(null);

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider = ({ children }) => {
  const [parkingLots, setParkingLots] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParkingLots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await parkingLotService.getAllParkingLots();
      if (response.success) {
        setParkingLots(response.data || []);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError('Failed to fetch parking lots');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const parkVehicle = async (vehicleType, vehicleRegistration) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parkingService.parkVehicle(vehicleType, vehicleRegistration);
      if (response.success) {
        setCurrentVehicle(response.data);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError('Failed to park vehicle');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const exitVehicle = async (vehicleRegistration) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parkingService.exitVehicle(vehicleRegistration);
      if (response.success) {
        setCurrentVehicle(null);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError('Failed to process vehicle exit');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getVehicleStatus = async (vehicleRegistration) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parkingService.getVehicleStatus(vehicleRegistration);
      if (response.success) {
        setCurrentVehicle(response.data);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError('Failed to fetch vehicle status');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  
  const createParkingLot = async (name, address, totalFloors) => {
    setLoading(true);
    setError(null);
    try {
      const response = await parkingLotService.createParkingLot(name, address, totalFloors);
      if (response.success) {
        await fetchParkingLots(); // Refresh list
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError('Failed to create parking lot');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    parkingLots,
    currentVehicle,
    loading,
    error,
    fetchParkingLots,
    parkVehicle,
    exitVehicle,
    getVehicleStatus,
    createParkingLot,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export default ParkingContext;
