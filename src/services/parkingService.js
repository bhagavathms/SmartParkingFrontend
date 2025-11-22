import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const parkingService = {
  async parkVehicle(vehicleType, vehicleRegistration) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PARKING.ENTRY, {
      vehicleType,
      vehicleRegistration,
    });
    return response;
  },

  async exitVehicle(vehicleRegistration) {
    const response = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.PARKING.EXIT}/${vehicleRegistration}`
    );
    return response;
  },

  async getVehicleStatus(vehicleRegistration) {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PARKING.VEHICLE}/${vehicleRegistration}`
    );
    return response;
  },

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
