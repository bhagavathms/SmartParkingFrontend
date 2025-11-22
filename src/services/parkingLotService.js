import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const parkingLotService = {
  async createParkingLot(name, address, totalFloors) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.PARKING_LOTS.BASE, {
        name,
        address,
        totalFloors,
      });

      return response;
    } catch (error) {
      console.error('Create parking lot error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create parking lot',
        error,
      };
    }
  },


  async getAllParkingLots() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PARKING_LOTS.BASE);
      return response;
    } catch (error) {
      console.error('Get parking lots error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch parking lots',
        error,
      };
    }
  },

  async getParkingLotById(parkingLotId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PARKING_LOTS.BASE}/${parkingLotId}`
      );

      return response;
    } catch (error) {
      console.error('Get parking lot error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch parking lot',
        error,
      };
    }
  },

  
  async addFloor(floorNo, parkingLotId, slotConfiguration) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.PARKING_LOTS.FLOORS, {
        floorNo,
        parkingLotId,
        slotConfiguration,
      });

      return response;
    } catch (error) {
      console.error('Add floor error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to add floor',
        error,
      };
    }
  },

  
  async getFloorById(floorId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PARKING_LOTS.FLOOR_BY_ID}/${floorId}`
      );

      return response;
    } catch (error) {
      console.error('Get floor error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch floor',
        error,
      };
    }
  },

  
  async getFloorsByParkingLotId(parkingLotId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PARKING_LOTS.FLOORS_BY_LOT}/${parkingLotId}/floors`
      );

      return response;
    } catch (error) {
      console.error('Get floors error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch floors',
        error,
      };
    }
  },
};

export default parkingLotService;
