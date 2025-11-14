/**
 * Parking Service
 * Handles vehicle entry, exit, and status operations
 */

import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const parkingService = {
  /**
   * Park a vehicle (Entry)
   * @param {string} vehicleType - CAR, BIKE, or TRUCK
   * @param {string} vehicleRegistration - Vehicle registration number
   */
  async parkVehicle(vehicleType, vehicleRegistration) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PARKING.ENTRY, {
      vehicleType,
      vehicleRegistration,
    });
    return response;
  },

  /**
   * Exit vehicle and generate bill
   * @param {string} vehicleRegistration - Vehicle registration number
   */
  async exitVehicle(vehicleRegistration) {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.PARKING.EXIT}/${vehicleRegistration}`
    );
    return response;
  },

  /**
   * Get vehicle status by registration number
   * @param {string} vehicleRegistration - Vehicle registration number
   */
  async getVehicleStatus(vehicleRegistration) {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PARKING.VEHICLE}/${vehicleRegistration}`
    );
    return response;
  },

  /**
   * Update bill amount for an exited vehicle
   * @param {string} vehicleId - Vehicle ID
   * @param {number} billAmt - Updated bill amount
   * @param {object} pricingDetails - Optional pricing breakdown details
   */
  async updateBill(vehicleId, billAmt, pricingDetails = null) {
    const requestBody = {
      billAmt: billAmt,
    };

    if (pricingDetails) {
      requestBody.pricingDetails = pricingDetails;
    }

    const response = await apiClient.put(
      `/parking/bill/${vehicleId}`,
      requestBody
    );
    return response;
  },
};

export default parkingService;
