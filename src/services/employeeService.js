/**
 * Employee Service
 * Handles employee CRUD operations
 */

import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const employeeService = {
  /**
   * Create a new employee
   * @param {object} employeeData - Employee details
   */
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

  /**
   * Get all employees
   */
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

  /**
   * Get employee by ID
   * @param {string} empId - Employee ID
   */
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

  /**
   * Get employee by email
   * @param {string} email - Employee email
   */
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

  /**
   * Update employee
   * @param {string} empId - Employee ID
   * @param {object} employeeData - Updated employee data
   */
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

  /**
   * Delete employee
   * @param {string} empId - Employee ID
   */
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
