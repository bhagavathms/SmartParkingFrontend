import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const employeeService = {
  async createEmployee(employeeData) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.EMPLOYEES.BASE,
        employeeData
      );

      return response;
    } catch (error) {
      console.error('Create employee error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create employee',
        error,
      };
    }
  },

  async getAllEmployees() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.EMPLOYEES.BASE);
      return response;
    } catch (error) {
      console.error('Get employees error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch employees',
        error,
      };
    }
  },

  async getEmployeeById(empId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.EMPLOYEES.BASE}/${empId}`
      );

      return response;
    } catch (error) {
      console.error('Get employee error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch employee',
        error,
      };
    }
  },

  async getEmployeeByEmail(email) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.EMPLOYEES.BY_EMAIL}/${email}`
      );

      return response;
    } catch (error) {
      console.error('Get employee by email error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch employee',
        error,
      };
    }
  },

  async updateEmployee(empId, employeeData) {
    try {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.EMPLOYEES.BASE}/${empId}`,
        employeeData
      );

      return response;
    } catch (error) {
      console.error('Update employee error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update employee',
        error,
      };
    }
  },

  async deleteEmployee(empId) {
    try {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.EMPLOYEES.BASE}/${empId}`
      );

      return response;
    } catch (error) {
      console.error('Delete employee error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to delete employee',
        error,
      };
    }
  },
};

export default employeeService;
