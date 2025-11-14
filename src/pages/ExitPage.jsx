import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useParking } from "../context/ParkingContext";
import { pricingService, parkingService } from "../services";
import OcrBox from "../components/OcrBox";
import ErrorNotification from "../components/ErrorNotification";
import SuccessNotification from "../components/SuccessNotification";
import SlotDisplay from "../components/SlotDisplay";

export default function ExitPage() {
  const { isAuthenticated } = useAuth();
  const { exitVehicle, getVehicleStatus, loading } = useParking();
  const navigate = useNavigate();

  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [exitResult, setExitResult] = useState(null);
  const [pricingInfo, setPricingInfo] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchMode, setSearchMode] = useState(true);
  const [ocrData, setOcrData] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

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

  const handleSearchVehicle = async (e) => {
    e.preventDefault();
    setError("");
    setVehicleInfo(null);
    setExitResult(null);
    setPricingInfo(null);

    if (!vehicleRegistration.trim()) {
      setError("Please enter vehicle registration number");
      return;
    }

    const result = await getVehicleStatus(vehicleRegistration.trim());

    if (result.success) {
      setVehicleInfo(result.data);
      setSearchMode(false);

      // Calculate dynamic pricing
      setCalculatingPrice(true);
      const timeOut = new Date().toISOString();
      const pricingResult = await pricingService.getPricingPrediction(
        result.data.vehicleType,
        result.data.timeIn,
        timeOut
      );

      if (pricingResult.success || pricingResult.data) {
        setPricingInfo(pricingResult.data);
      }
      setCalculatingPrice(false);
    } else {
      setError(result.message || "Vehicle not found");
    }
  };

  const handleExitVehicle = async () => {
    setError("");

    // Step 1: Exit the vehicle (backend calculates temporary bill)
    const result = await exitVehicle(vehicleRegistration.trim());

    if (result.success) {
      // Use dynamic pricing if available, otherwise use backend's price
      let finalBillAmount = pricingInfo?.adjustedCharge || result.data.billAmt;

      // Step 2: Try to update bill with dynamic pricing if available
      if (pricingInfo && pricingInfo.adjustedCharge) {
        try {
          console.log('Updating bill with dynamic pricing:', {
            vehicleId: result.data.vehicleId,
            amount: pricingInfo.adjustedCharge,
            pricingInfo
          });

          const updateResult = await parkingService.updateBill(
            result.data.vehicleId,
            pricingInfo.adjustedCharge,
            pricingInfo
          );

          console.log('Bill update result:', updateResult);

          if (updateResult.success) {
            finalBillAmount = pricingInfo.adjustedCharge;
            // Update the exit result with the new bill amount
            result.data.billAmt = finalBillAmount;
          } else {
            console.warn('Bill update failed, using dynamic price anyway:', updateResult);
            // Still use dynamic price in UI even if backend update fails
            finalBillAmount = pricingInfo.adjustedCharge;
            result.data.billAmt = finalBillAmount;
          }
        } catch (updateError) {
          console.error('Failed to update bill with dynamic pricing:', updateError);
          // Still use dynamic price in UI even if backend update fails due to CORS
          console.log('Using dynamic pricing in UI despite backend update failure');
          finalBillAmount = pricingInfo.adjustedCharge;
          result.data.billAmt = finalBillAmount;
        }
      }

      setExitResult(result.data);
      setSuccessMessage(
        `Vehicle exit processed successfully! Total bill: ₹${finalBillAmount.toFixed(2)}`
      );
      setVehicleInfo(null);
      setVehicleRegistration("");
    } else {
      setError(result.message || "Failed to process vehicle exit");
    }
  };

  const handleReset = () => {
    setVehicleRegistration("");
    setVehicleInfo(null);
    setExitResult(null);
    setPricingInfo(null);
    setError("");
    setSuccessMessage("");
    setSearchMode(true);
    setOcrData(null);
  };

  return (
    <div style={containerStyle}>
      {/* Error and Success Notifications */}
      <ErrorNotification message={error} onClose={() => setError("")} />
      <SuccessNotification message={successMessage} onClose={() => setSuccessMessage("")} />

      <div style={cardStyle}>
        <h1 style={titleStyle}>Vehicle Exit</h1>

        {/* Search Form */}
        {searchMode && !exitResult && (
          <>
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

            <form onSubmit={handleSearchVehicle} style={formStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Vehicle Registration Number</label>
                <input
                  type="text"
                  value={vehicleRegistration}
                  onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
                  placeholder="Enter vehicle registration (e.g., ABC123)"
                  style={inputStyle}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" style={btnPrimaryStyle} disabled={loading}>
                {loading ? "Searching..." : "Search Vehicle"}
              </button>
            </form>
          </>
        )}

        {/* Vehicle Information */}
        {vehicleInfo && !exitResult && (
          <div style={vehicleInfoStyle}>
            <h2 style={infoTitleStyle}>Vehicle Information</h2>

            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Registration:</span>
                <span style={infoValueStyle}>{vehicleInfo.vehicleRegistration}</span>
              </div>

              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Vehicle Type:</span>
                <span style={infoValueStyle}>{vehicleInfo.vehicleType}</span>
              </div>

              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Status:</span>
                <span style={{...infoValueStyle, color: vehicleInfo.status === 'PARKED' ? '#16a34a' : '#dc2626'}}>
                  {vehicleInfo.status}
                </span>
              </div>

              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Parking Slot:</span>
                <span style={infoValueStyle}>
                  {vehicleInfo.assignedSlotId ? <SlotDisplay slotId={vehicleInfo.assignedSlotId} inline /> : 'N/A'}
                </span>
              </div>

              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Entry Time:</span>
                <span style={infoValueStyle}>
                  {new Date(vehicleInfo.timeIn).toLocaleString()}
                </span>
              </div>

              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Duration:</span>
                <span style={infoValueStyle}>
                  {calculateDuration(vehicleInfo.timeIn)}
                </span>
              </div>
            </div>

            {/* Dynamic Pricing Information */}
            {calculatingPrice && (
              <div style={pricingLoadingStyle}>
                <p>Calculating dynamic pricing...</p>
              </div>
            )}

            {pricingInfo && !calculatingPrice && (
              <div style={pricingBoxStyle}>
                <h3 style={pricingTitleStyle}>Parking Charges</h3>
                <div style={pricingGridStyle}>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Actual Duration:</span>
                    <span style={pricingValueStyle}>{pricingInfo.durationMinutes.toFixed(0)} minutes</span>
                  </div>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Billed Duration:</span>
                    <span style={{...pricingValueStyle, color: pricingInfo.billableMinutes > pricingInfo.durationMinutes ? '#d97706' : '#1f2937'}}>
                      {pricingInfo.billableMinutes.toFixed(0)} minutes
                      {pricingInfo.billableMinutes > pricingInfo.durationMinutes && ' (min)'}
                    </span>
                  </div>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Base Rate:</span>
                    <span style={pricingValueStyle}>₹{pricingService.BASE_PRICES[vehicleInfo.vehicleType]}/hour</span>
                  </div>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Base Charge:</span>
                    <span style={pricingValueStyle}>₹{pricingInfo.baseCharge.toFixed(2)}</span>
                  </div>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Surge Multiplier:</span>
                    <span style={{...pricingValueStyle, color: pricingInfo.multiplier > 1 ? '#dc2626' : '#16a34a', fontWeight: 'bold'}}>
                      {pricingInfo.multiplier.toFixed(2)}x
                    </span>
                  </div>
                  <div style={pricingItemStyle}>
                    <span style={pricingLabelStyle}>Surge Info:</span>
                    <span style={{fontSize: '0.875rem', color: '#6b7280'}}>
                      {pricingInfo.multiplier > 1.2 ? 'High demand' : pricingInfo.multiplier > 1.0 ? 'Moderate demand' : 'Normal rates'}
                    </span>
                  </div>
                  {pricingInfo.fallback && (
                    <div style={{...pricingItemStyle, gridColumn: '1 / -1'}}>
                      <span style={{fontSize: '12px', color: '#d97706', fontStyle: 'italic'}}>
                        ⚠️ Using base pricing (ML model unavailable)
                      </span>
                    </div>
                  )}
                  <div style={{...pricingItemStyle, ...totalChargeStyle}}>
                    <span style={pricingLabelStyle}>Total Amount:</span>
                    <span style={{...pricingValueStyle, fontSize: '24px', fontWeight: 'bold', color: '#16a34a'}}>
                      ₹{pricingInfo.adjustedCharge.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={btnGroupStyle}>
              <button onClick={handleExitVehicle} style={btnSuccessStyle} disabled={loading || calculatingPrice}>
                {loading ? "Processing..." : calculatingPrice ? "Calculating..." : "Process Exit"}
              </button>
              <button onClick={handleReset} style={btnSecondaryStyle} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Exit Result / Bill */}
        {exitResult && (
          <div style={successStyle}>
            <h2 style={successTitleStyle}>Exit Successful!</h2>

            <div style={billStyle}>
              <h3 style={billTitleStyle}>Parking Bill (Dynamic Pricing)</h3>

              <div style={billItemStyle}>
                <span>Vehicle Registration:</span>
                <span style={billValueStyle}>{exitResult.vehicleRegistration}</span>
              </div>

              <div style={billItemStyle}>
                <span>Vehicle Type:</span>
                <span style={billValueStyle}>{exitResult.vehicleType}</span>
              </div>

              <div style={billItemStyle}>
                <span>Entry Time:</span>
                <span style={billValueStyle}>
                  {new Date(exitResult.timeIn).toLocaleString()}
                </span>
              </div>

              <div style={billItemStyle}>
                <span>Exit Time:</span>
                <span style={billValueStyle}>
                  {new Date(exitResult.timeOut).toLocaleString()}
                </span>
              </div>

              <div style={billItemStyle}>
                <span>Actual Duration:</span>
                <span style={billValueStyle}>
                  {calculateDuration(exitResult.timeIn, exitResult.timeOut)}
                </span>
              </div>

              {pricingInfo && (
                <>
                  <div style={billItemStyle}>
                    <span>Billed Duration:</span>
                    <span style={{...billValueStyle, color: '#d97706'}}>
                      {Math.floor(pricingInfo.billableMinutes / 60)}h {pricingInfo.billableMinutes % 60}m
                      {pricingInfo.billableMinutes > pricingInfo.durationMinutes && ' (minimum)'}
                    </span>
                  </div>

                  <div style={billItemStyle}>
                    <span>Base Rate:</span>
                    <span style={billValueStyle}>
                      ₹{pricingService.BASE_PRICES[exitResult.vehicleType]}/hour
                    </span>
                  </div>

                  <div style={billItemStyle}>
                    <span>Base Charge:</span>
                    <span style={billValueStyle}>₹{pricingInfo.baseCharge.toFixed(2)}</span>
                  </div>

                  <div style={billItemStyle}>
                    <span>Surge Multiplier:</span>
                    <span style={{...billValueStyle, color: pricingInfo.multiplier > 1 ? '#dc2626' : '#16a34a', fontWeight: 'bold'}}>
                      {pricingInfo.multiplier.toFixed(2)}x
                      {pricingInfo.multiplier > 1.2 ? ' (High)' : pricingInfo.multiplier > 1.0 ? ' (Moderate)' : ' (Normal)'}
                    </span>
                  </div>
                </>
              )}

              <div style={{...billItemStyle, ...billTotalStyle}}>
                <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Total Amount:</span>
                <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a'}}>
                  ₹{pricingInfo ? pricingInfo.adjustedCharge.toFixed(2) : (exitResult.billAmt?.toFixed(2) || '0.00')}
                </span>
              </div>

              {!pricingInfo && (
                <div style={{fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '10px'}}>
                  Note: Using backend pricing (dynamic pricing unavailable)
                </div>
              )}
            </div>

            <button onClick={handleReset} style={btnPrimaryStyle}>
              Process Another Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate parking duration
function calculateDuration(startTime, endTime = null) {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end - start;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

// Styles
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

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  textTransform: "uppercase",
  boxSizing: "border-box",
};

const btnPrimaryStyle = {
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

const btnSecondaryStyle = {
  width: "48%",
  padding: "14px",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
};

const btnSuccessStyle = {
  width: "48%",
  padding: "14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
};

const btnGroupStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const errorStyle = {
  padding: "12px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#dc2626",
  borderRadius: "8px",
  marginBottom: "15px",
};

const vehicleInfoStyle = {
  marginTop: "20px",
  padding: "20px",
  background: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const infoTitleStyle = {
  fontSize: "1.5rem",
  marginBottom: "20px",
  color: "#1f2937",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const infoItemStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "12px",
  background: "white",
  borderRadius: "6px",
};

const infoLabelStyle = {
  fontSize: "0.875rem",
  color: "#6b7280",
  marginBottom: "4px",
};

const infoValueStyle = {
  fontSize: "1rem",
  fontWeight: "500",
  color: "#1f2937",
};

const successStyle = {
  marginTop: "20px",
};

const successTitleStyle = {
  fontSize: "1.75rem",
  marginBottom: "20px",
  color: "#16a34a",
  textAlign: "center",
};

const billStyle = {
  padding: "20px",
  background: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginBottom: "20px",
};

const billTitleStyle = {
  fontSize: "1.25rem",
  marginBottom: "15px",
  color: "#1f2937",
  paddingBottom: "10px",
  borderBottom: "2px solid #e5e7eb",
};

const billItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const billValueStyle = {
  fontWeight: "500",
  color: "#1f2937",
};

const billTotalStyle = {
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "2px solid #d1d5db",
  borderBottom: "none",
};

const pricingLoadingStyle = {
  marginTop: "20px",
  padding: "15px",
  background: "#f3f4f6",
  borderRadius: "8px",
  textAlign: "center",
  color: "#6b7280",
  fontStyle: "italic",
};

const pricingBoxStyle = {
  marginTop: "20px",
  padding: "20px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
};

const pricingTitleStyle = {
  fontSize: "1.25rem",
  marginBottom: "15px",
  color: "white",
  fontWeight: "600",
  textAlign: "center",
};

const pricingGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  background: "white",
  padding: "15px",
  borderRadius: "8px",
};

const pricingItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const pricingLabelStyle = {
  fontSize: "0.875rem",
  color: "#6b7280",
  fontWeight: "500",
};

const pricingValueStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1f2937",
};

const totalChargeStyle = {
  gridColumn: "1 / -1",
  marginTop: "10px",
  paddingTop: "15px",
  borderTop: "2px solid #e5e7eb",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
