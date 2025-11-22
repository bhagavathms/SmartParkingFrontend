import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parkingLotService } from "../services";
import ErrorNotification from "../components/ErrorNotification";

export default function ParkingLotView() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    setLoading(true);
    const result = await parkingLotService.getAllParkingLots();
    if (result.success) {
      setParkingLots(result.data);
      if (result.data.length > 0) {
        setSelectedLot(result.data[0]);
        fetchFloors(result.data[0].parkingLotId);
      }
    } else {
      setError(result.message || "Failed to load parking lots");
    }
    setLoading(false);
  };

  const fetchFloors = async (lotId) => {
    setLoading(true);
    const result = await parkingLotService.getFloorsByParkingLotId(lotId);
    if (result.success) {
      const sortedFloors = result.data.sort((a, b) => a.floorNo - b.floorNo);
      setFloors(sortedFloors);
      if (sortedFloors.length > 0) {
        setSelectedFloor(sortedFloors[0]);
        fetchSlots(sortedFloors[0].floorId);
      }
    } else {
      setError(result.message || "Failed to load floors");
    }
    setLoading(false);
  };

  const fetchSlots = async (floorId) => {
    setLoading(true);
    const result = await parkingLotService.getFloorById(floorId);
    if (result.success && result.data && result.data.slots) {
      console.log("Sample slot with all properties:", JSON.stringify(result.data.slots[0], null, 2));
      setSlots(result.data.slots);
    } else {
      setError(result.message || "Failed to load slots");
      setSlots([]);
    }
    setLoading(false);
  };

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    fetchSlots(floor.floorId);
  };


  const groupSlotsByType = () => {
    const grouped = {
      TWO_WHEELER: [],
      FOUR_WHEELER: [],
      HEAVY_VEHICLE: [],
    };

    slots.forEach((slot) => {
      if (grouped[slot.slotType]) {
        grouped[slot.slotType].push(slot);
      }
    });

    return grouped;
  };

  const generateSlotNumber = (slotType, index, floorNo) => {
    const typeCode = {
      TWO_WHEELER: 'TW',
      FOUR_WHEELER: 'FW',
      HEAVY_VEHICLE: 'HV',
    };

    const code = typeCode[slotType] || 'XX';
    const paddedIndex = String(index + 1).padStart(3, '0');

    return `SLOT-F${floorNo}-${code}-${paddedIndex}`;
  };

  const groupedSlots = groupSlotsByType();

  return (
    <div style={containerStyle}>
      <ErrorNotification message={error} onClose={() => setError("")} />

      <div style={headerStyle}>
        <h1 style={titleStyle}>Parking Lot View</h1>
        {selectedLot && (
          <div style={lotInfoStyle}>
            <h2>{selectedLot.name}</h2>
            <p>{selectedLot.address}</p>
            <p>Total Floors: {selectedLot.totalFloors}</p>
          </div>
        )}
      </div>

      {loading && <div style={loadingStyle}>Loading...</div>}

      {!loading && floors.length > 0 && (
        <div style={contentStyle}>
          <div style={floorSelectorStyle}>
            <h3 style={selectorTitleStyle}>Select Floor</h3>
            {floors.map((floor) => (
              <button
                key={floor.floorId}
                onClick={() => handleFloorChange(floor)}
                style={{
                  ...floorButtonStyle,
                  ...(selectedFloor?.floorId === floor.floorId
                    ? floorButtonActiveStyle
                    : {}),
                }}
              >
                Floor {floor.floorNo}
              </button>
            ))}
          </div>

          <div style={slotsContainerStyle}>
            {selectedFloor && (
              <div>
                <h2 style={floorTitleStyle}>
                  Floor {selectedFloor.floorNo} - Parking Slots
                </h2>


                <div style={legendStyle}>
                  <div style={legendItemStyle}>
                    <div style={{ ...slotBoxStyle, ...slotOccupiedStyle }}></div>
                    <span>Occupied</span>
                  </div>
                  <div style={legendItemStyle}>
                    <div style={{ ...slotBoxStyle, ...slotAvailableStyle }}></div>
                    <span>Available</span>
                  </div>
                </div>

                {groupedSlots.TWO_WHEELER.length > 0 && (
                  <div style={slotSectionStyle}>
                    <h3 style={slotTypeHeaderStyle}>
                      Two-Wheeler Slots (Bikes/Motorcycles)
                    </h3>
                    <div style={slotGridStyle}>
                      {groupedSlots.TWO_WHEELER.map((slot, index) => (
                        <div
                          key={slot.slotId}
                          style={{
                            ...slotCardStyle,
                            ...(slot.slotStatus === "AVAILABLE"
                              ? slotAvailableStyle
                              : slotOccupiedStyle),
                          }}
                          title={
                            slot.slotStatus === "AVAILABLE"
                              ? "Available"
                              : `Occupied - Vehicle ID: ${slot.currentVehicleId || "Unknown"}`
                          }
                        >
                          <div style={slotNumberStyle}>
                            {generateSlotNumber('TWO_WHEELER', index, selectedFloor?.floorNo)}
                          </div>
                          <div style={slotStatusStyle}>
                            {slot.slotStatus === "AVAILABLE" ? "FREE" : "OCCUPIED"}
                          </div>
                          {slot.slotStatus !== "AVAILABLE" && slot.currentVehicleId && (
                            <div style={slotVehicleStyle}>
                              ID: {slot.currentVehicleId.substring(0, 8)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {groupedSlots.FOUR_WHEELER.length > 0 && (
                  <div style={slotSectionStyle}>
                    <h3 style={slotTypeHeaderStyle}>
                      Four-Wheeler Slots (Cars)
                    </h3>
                    <div style={slotGridStyle}>
                      {groupedSlots.FOUR_WHEELER.map((slot, index) => (
                        <div
                          key={slot.slotId}
                          style={{
                            ...slotCardStyle,
                            ...(slot.slotStatus === "AVAILABLE"
                              ? slotAvailableStyle
                              : slotOccupiedStyle),
                          }}
                          title={
                            slot.slotStatus === "AVAILABLE"
                              ? "Available"
                              : `Occupied - Vehicle ID: ${slot.currentVehicleId || "Unknown"}`
                          }
                        >
                          <div style={slotNumberStyle}>
                            {generateSlotNumber('FOUR_WHEELER', index, selectedFloor?.floorNo)}
                          </div>
                          <div style={slotStatusStyle}>
                            {slot.slotStatus === "AVAILABLE" ? "FREE" : "OCCUPIED"}
                          </div>
                          {slot.slotStatus !== "AVAILABLE" && slot.currentVehicleId && (
                            <div style={slotVehicleStyle}>
                              ID: {slot.currentVehicleId.substring(0, 8)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {groupedSlots.HEAVY_VEHICLE.length > 0 && (
                  <div style={slotSectionStyle}>
                    <h3 style={slotTypeHeaderStyle}>
                      Heavy Vehicle Slots (Trucks/Buses)
                    </h3>
                    <div style={slotGridStyle}>
                      {groupedSlots.HEAVY_VEHICLE.map((slot, index) => (
                        <div
                          key={slot.slotId}
                          style={{
                            ...slotCardStyle,
                            ...(slot.slotStatus === "AVAILABLE"
                              ? slotAvailableStyle
                              : slotOccupiedStyle),
                          }}
                          title={
                            slot.slotStatus === "AVAILABLE"
                              ? "Available"
                              : `Occupied - Vehicle ID: ${slot.currentVehicleId || "Unknown"}`
                          }
                        >
                          <div style={slotNumberStyle}>
                            {generateSlotNumber('HEAVY_VEHICLE', index, selectedFloor?.floorNo)}
                          </div>
                          <div style={slotStatusStyle}>
                            {slot.slotStatus === "AVAILABLE" ? "FREE" : "OCCUPIED"}
                          </div>
                          {slot.slotStatus !== "AVAILABLE" && slot.currentVehicleId && (
                            <div style={slotVehicleStyle}>
                              ID: {slot.currentVehicleId.substring(0, 8)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && floors.length === 0 && (
        <div style={emptyStateStyle}>
          <p>No parking floors found. Please create a parking lot first.</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "20px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "30px",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "2rem",
  color: "#1f2937",
  marginBottom: "10px",
};

const lotInfoStyle = {
  background: "#f9fafb",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const loadingStyle = {
  textAlign: "center",
  padding: "40px",
  fontSize: "1.2rem",
  color: "#6b7280",
};

const contentStyle = {
  display: "flex",
  gap: "20px",
};

const floorSelectorStyle = {
  width: "200px",
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  height: "fit-content",
  position: "sticky",
  top: "20px",
};

const selectorTitleStyle = {
  fontSize: "1.2rem",
  marginBottom: "15px",
  color: "#1f2937",
};

const floorButtonStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  background: "#f9fafb",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s",
  color: "#374151",
};

const floorButtonActiveStyle = {
  background: "#3b82f6",
  color: "white",
  borderColor: "#3b82f6",
};

const slotsContainerStyle = {
  flex: 1,
  background: "white",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const floorTitleStyle = {
  fontSize: "1.5rem",
  marginBottom: "20px",
  color: "#1f2937",
};

const legendStyle = {
  display: "flex",
  gap: "30px",
  marginBottom: "30px",
  padding: "15px",
  background: "#f9fafb",
  borderRadius: "8px",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
  fontWeight: "500",
};

const slotBoxStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "4px",
};

const slotSectionStyle = {
  marginBottom: "40px",
};

const slotTypeHeaderStyle = {
  fontSize: "1.2rem",
  marginBottom: "15px",
  color: "#374151",
  paddingBottom: "10px",
  borderBottom: "2px solid #e5e7eb",
};

const slotGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "15px",
};

const slotCardStyle = {
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
  border: "2px solid",
  fontWeight: "500",
};

const slotAvailableStyle = {
  background: "#dcfce7",
  borderColor: "#22c55e",
  color: "#166534",
};

const slotOccupiedStyle = {
  background: "#fee2e2",
  borderColor: "#ef4444",
  color: "#991b1b",
};

const slotNumberStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "5px",
};

const slotStatusStyle = {
  fontSize: "12px",
  fontWeight: "600",
};

const slotVehicleStyle = {
  fontSize: "10px",
  marginTop: "5px",
  fontWeight: "normal",
  opacity: 0.8,
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#6b7280",
  fontSize: "1.1rem",
};
