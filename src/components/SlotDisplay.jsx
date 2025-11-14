/**
 * SlotDisplay Component
 * Fetches and displays human-readable slot information
 */

import React, { useState, useEffect } from 'react';
import { parkingLotService } from '../services';

const SlotDisplay = ({ slotId, inline = false }) => {
  const [slotInfo, setSlotInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlotInfo = async () => {
      if (!slotId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all parking lots to find the slot
        const lotsResult = await parkingLotService.getAllParkingLots();

        if (lotsResult.success && lotsResult.data) {
          // Search through all floors in all lots
          for (const lot of lotsResult.data) {
            const floorsResult = await parkingLotService.getFloorsByParkingLotId(lot.parkingLotId);

            if (floorsResult.success && floorsResult.data) {
              for (const floor of floorsResult.data) {
                const floorDetailResult = await parkingLotService.getFloorById(floor.floorId);

                if (floorDetailResult.success && floorDetailResult.data && floorDetailResult.data.slots) {
                  const slots = floorDetailResult.data.slots;

                  // Group slots by type to get proper index
                  const slotsByType = {
                    TWO_WHEELER: [],
                    FOUR_WHEELER: [],
                    HEAVY_VEHICLE: [],
                  };

                  slots.forEach(slot => {
                    if (slotsByType[slot.slotType]) {
                      slotsByType[slot.slotType].push(slot);
                    }
                  });

                  // Find our slot
                  for (const [type, typeSlots] of Object.entries(slotsByType)) {
                    const index = typeSlots.findIndex(s => s.slotId === slotId);
                    if (index !== -1) {
                      const typeCode = {
                        TWO_WHEELER: 'TW',
                        FOUR_WHEELER: 'FW',
                        HEAVY_VEHICLE: 'HV',
                      }[type];

                      const slotNumber = `SLOT-F${floor.floorNo}-${typeCode}-${String(index + 1).padStart(3, '0')}`;

                      setSlotInfo({
                        slotNumber,
                        floorNo: floor.floorNo,
                        slotType: type,
                      });
                      setLoading(false);
                      return;
                    }
                  }
                }
              }
            }
          }
        }

        // If slot not found, show abbreviated ID
        setSlotInfo({
          slotNumber: slotId.substring(0, 8),
          floorNo: '?',
          slotType: 'UNKNOWN',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching slot info:', error);
        setSlotInfo({
          slotNumber: slotId.substring(0, 8),
          floorNo: '?',
          slotType: 'ERROR',
        });
        setLoading(false);
      }
    };

    fetchSlotInfo();
  }, [slotId]);

  if (!slotId) return <span>N/A</span>;
  if (loading) return <span>Loading...</span>;
  if (!slotInfo) return <span>{slotId.substring(0, 8)}</span>;

  return inline ? (
    <span>{slotInfo.slotNumber}</span>
  ) : (
    <span title={`Slot ID: ${slotId}`}>{slotInfo.slotNumber}</span>
  );
};

export default SlotDisplay;
