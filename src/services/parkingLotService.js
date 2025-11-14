/**
 * Parking Lot Service
 * Handles parking lot and floor management operations
 */

import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const parkingLotService = {
  /**
   * Create a new parking lot
   * @param {string} name - Parking lot name
   * @param {string} address - Parking lot address
   * @param {number} totalFloors - Total number of floors
   */
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

  /**
   * Get all parking lots
   */
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

  /**
   * Get parking lot by ID
   * @param {string} parkingLotId - Parking lot ID
   */
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

  /**
   * Add a floor to parking lot
   * @param {number} floorNo - Floor number
   * @param {string} parkingLotId - Parking lot ID
   * @param {object} slotConfiguration - Slot configuration {COMPACT: 10, STANDARD: 20, LARGE: 5}
   */
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

  /**
   * Get floor by ID
   * @param {string} floorId - Floor ID
   */
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

  /**
   * Get all floors in a parking lot
   * @param {string} parkingLotId - Parking lot ID
   */
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
