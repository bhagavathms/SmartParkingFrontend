import React, { useState } from "react";

export default function OcrBox({ onDetected }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plate, setPlate] = useState("");

  // Extract valid Indian number plate (8–10 characters)
  const extractPlate = (rawArray) => {
    if (!rawArray || !Array.isArray(rawArray)) return "";

    for (let item of rawArray) {
      let text = item.text.toUpperCase().replace(/[^A-Z0-9]/g, "");

      if (text.length >= 8 && text.length <= 10) {
        return text; // First valid match
      }
    }

    return "";
  };

  // When user picks image
  const handleFile = (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];

    setPreview(URL.createObjectURL(file));
    setError("");
    setPlate("");

    uploadToOCR(file);
  };

  // Upload to HuggingFace FastAPI OCR backend
  const uploadToOCR = async (file) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://amankumar00-smartParking.hf.space/ocr",
        {
          method: "POST",
          body: formData,
        } 
      );

      const data = await response.json();
      setLoading(false);

      if (data && data.raw) {
        const extracted = extractPlate(data.raw);

        if (extracted) {
          setPlate(extracted);

          // Send extracted plate to parent page
          if (onDetected) onDetected(extracted);
        } else {
          setError("Could not extract a valid number plate.");
        }
      } else {
        setError("Invalid OCR response.");
      }
    } catch (err) {
      setLoading(false);
      setError("Error connecting to OCR server.");
    }
  };

  return (
    <div style={boxStyle}>
      <h2>Upload Vehicle Image</h2>

      <input type="file" accept="image/*" onChange={handleFile} />

      {preview && <img src={preview} alt="preview" style={previewStyle} />}

      {loading && <p>Extracting number...</p>}

      {plate && (
        <div style={successBox}>
          <strong>Vehicle Number:</strong> {plate}
        </div>
      )}

      {error && (
        <div style={errorBox}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

// ---------- STYLES ----------
const boxStyle = {
  padding: "20px",
  background: "white",
  borderRadius: "10px",
  textAlign: "center",
  maxWidth: "500px",
  margin: "20px auto",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const previewStyle = {
  width: "80%",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const errorBox = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "#ffdddd",
  color: "#a70000",
  border: "1px solid #ff8888",
  borderRadius: "6px",
  fontWeight: "bold",
};

const successBox = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "#ddffdd",
  color: "#006600",
  border: "1px solid #88ff88",
  borderRadius: "6px",
  fontWeight: "bold",
};
