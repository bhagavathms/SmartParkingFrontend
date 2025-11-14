import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useParking } from "../context/ParkingContext";
import OcrBox from "../components/OcrBox";
import ErrorNotification from "../components/ErrorNotification";
import SuccessNotification from "../components/SuccessNotification";
import SlotDisplay from "../components/SlotDisplay";

export default function EntryPage() {
  const { isAuthenticated } = useAuth();
  const { parkVehicle, loading } = useParking();
  const navigate = useNavigate();

  const [ocrData, setOcrData] = useState(null);
  const [vehicleType, setVehicleType] = useState("FOUR_WHEELER");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [parkingResult, setParkingResult] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleOcrDetection = (data) => {
    // OcrBox component passes the plate number directly as a string
    const plateNumber = typeof data === 'string' ? data : data?.text;

    if (plateNumber) {
      const cleanedPlate = plateNumber.toUpperCase().replace(/\s+/g, "");
      setVehicleRegistration(cleanedPlate);
      setOcrData({ text: cleanedPlate }); // Store in expected format for display
    }
  };

  const handleParkVehicle = async (e) => {
    e.preventDefault();
    setError("");
    setParkingResult(null);

    if (!vehicleRegistration.trim()) {
      setError("Please enter vehicle registration number");
      return;
    }

    const result = await parkVehicle(vehicleType, vehicleRegistration.trim());

    if (result.success) {
      setParkingResult(result.data);
      setSuccessMessage(
        `Vehicle ${result.data.vehicleRegistration} parked successfully in slot ${result.data.assignedSlotId}!`
      );
      setVehicleRegistration("");
      setOcrData(null);
    } else {
      setError(result.message || "Failed to park vehicle");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Error and Success Notifications */}
      <ErrorNotification message={error} onClose={() => setError("")} />
      <SuccessNotification message={successMessage} onClose={() => setSuccessMessage("")} />

      <div style={cardStyle}>
        <h1 style={titleStyle}>Vehicle Entry</h1>

        {/* OCR Component */}
        <div style={sectionStyle}>
          <h3>Scan Vehicle Number Plate</h3>
          <p style={hintTextStyle}>Scan to auto-fill registration number below</p>
          <OcrBox onDetected={handleOcrDetection} />
          {ocrData && (
            <div style={ocrResultStyle}>
              <p>Detected: <strong>{ocrData.text}</strong></p>
              <p style={{fontSize: '13px', marginTop: '5px', color: '#059669'}}>
                ✓ Registration auto-filled below
              </p>
            </div>
          )}
        </div>

        {/* Manual Entry Form */}
        <form onSubmit={handleParkVehicle} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              style={selectStyle}
              disabled={loading}
            >
              <option value="FOUR_WHEELER">Car (Four Wheeler)</option>
              <option value="TWO_WHEELER">Bike (Two Wheeler)</option>
              <option value="HEAVY_VEHICLE">Truck (Heavy Vehicle)</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Vehicle Registration Number</label>
            <input
              type="text"
              value={vehicleRegistration}
              onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              style={inputStyle}
              disabled={loading}
              required
            />
          </div>

          {parkingResult && (
            <div style={successStyle}>
              <h3>Vehicle Parked Successfully!</h3>
              <p><strong>Vehicle ID:</strong> {parkingResult.vehicleId}</p>
              <p><strong>Registration:</strong> {parkingResult.vehicleRegistration}</p>
              <p><strong>Type:</strong> {parkingResult.vehicleType}</p>
              <p><strong>Assigned Slot:</strong> <SlotDisplay slotId={parkingResult.assignedSlotId} inline /></p>
              <p><strong>Time In:</strong> {new Date(parkingResult.timeIn).toLocaleString()}</p>
            </div>
          )}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Processing..." : "Park Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
};

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  fontSize: "2rem",
  marginBottom: "30px",
  color: "#1f2937",
  textAlign: "center",
};

const sectionStyle = {
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "2px solid #e5e7eb",
};

const hintTextStyle = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "15px",
  fontStyle: "italic",
};

const ocrResultStyle = {
  marginTop: "15px",
  padding: "12px",
  background: "#f0fdf4",
  borderRadius: "8px",
  border: "1px solid #bbf7d0",
};

const formStyle = {
  marginTop: "20px",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "500",
  color: "#374151",
};

const selectStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  textTransform: "uppercase",
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background 0.2s",
};

const errorStyle = {
  padding: "12px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#dc2626",
  borderRadius: "8px",
  marginBottom: "15px",
};

const successStyle = {
  padding: "20px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#16a34a",
  borderRadius: "8px",
  marginBottom: "20px",
};
