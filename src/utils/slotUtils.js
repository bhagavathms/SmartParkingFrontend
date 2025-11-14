/**
 * Slot Utility Functions
 * Helper functions for slot number generation and formatting
 */

import { parkingLotService } from '../services';

/**
 * Generate human-readable slot number
 * @param {string} slotType - TWO_WHEELER, FOUR_WHEELER, or HEAVY_VEHICLE
 * @param {number} index - Zero-based index within the slot type group
 * @param {number} floorNo - Floor number
 * @returns {string} Formatted slot number (e.g., "SLOT-F0-TW-001")
 */
export const generateSlotNumber = (slotType, index, floorNo) => {
  const typeCode = {
    TWO_WHEELER: 'TW',
    FOUR_WHEELER: 'FW',
    HEAVY_VEHICLE: 'HV',
  };

  const code = typeCode[slotType] || 'XX';
  const paddedIndex = String(index + 1).padStart(3, '0');

  return `SLOT-F${floorNo}-${code}-${paddedIndex}`;
};

/**
 * Fetch slot details and generate human-readable slot number
 * @param {string} slotId - UUID of the slot
 * @returns {Promise<{slotNumber: string, slotType: string, floorNo: number} | null>}
 */
export const getSlotDisplayInfo = async (slotId) => {
  if (!slotId) return null;

  try {
    // First, we need to get all floors and find which floor has this slot
    // This is not optimal, but necessary given the current API structure

    // For now, return a simplified version using just the slot ID substring
    // This will be replaced when we fetch the actual floor data
    return {
      slotNumber: slotId.substring(0, 8),
      slotType: 'UNKNOWN',
      floorNo: '?'
    };
  } catch (error) {
    console.error('Error fetching slot info:', error);
    return null;
  }
};

/**
 * Get human-readable slot label from slot data
 * Used when we have the complete slot object with floor info
 * @param {object} slot - Slot object with slotType
 * @param {number} index - Index in the slot type group
 * @param {number} floorNo - Floor number
 * @returns {string} Formatted slot label
 */
export const getSlotLabel = (slot, index, floorNo) => {
  if (!slot) return 'N/A';
  return generateSlotNumber(slot.slotType, index, floorNo);
};
