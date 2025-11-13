import React, { useState } from "react";
import OcrBox from "../components/OcrBox";

export default function OcrPage() {
  const [plate, setPlate] = useState("");

  return (
    <div style={pageStyle}>
      <h1>OCR Number Plate Detection</h1>

      {/* OCR Component */}
      <OcrBox onDetected={(num) => setPlate(num)} />

      {/* Display extracted number for testing */}
      {plate && (
        <div style={detectedBox}>
          <h2>Final Extracted Number:</h2>
          <p>{plate}</p>
        </div>
      )}
    </div>
  );
}

// ---------- STYLES ----------
const pageStyle = {
  padding: "20px",
  textAlign: "center",
};

const detectedBox = {
  marginTop: "20px",
  padding: "15px",
  background: "#eef",
  borderRadius: "8px",
  fontSize: "20px",
  fontWeight: "bold",
};
