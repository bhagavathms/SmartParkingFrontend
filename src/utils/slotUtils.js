import { parkingLotService } from '../services';

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

export const getSlotDisplayInfo = async (slotId) => {
  if (!slotId) return null;

  try {
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

export const getSlotLabel = (slot, index, floorNo) => {
  if (!slot) return 'N/A';
  return generateSlotNumber(slot.slotType, index, floorNo);
};
