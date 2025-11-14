import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Welcome to Smart Parking</h1>

      <button
        style={btnStyle}
        onClick={() => navigate("/entry")}
      >
        🚗 Entry Vehicle
      </button>

      <button
        style={btnStyle}
        onClick={() => navigate("/exit")}
      >
        🚗 Exit Vehicle
      </button>

      <button
        style={btnStyle}
        onClick={() => navigate("/parking-view")}
      >
        🅿️ View Parking Lot
      </button>
    </div>
  );
}

const btnStyle = {
  display: "block",
  margin: "20px auto",
  padding: "20px 40px",
  fontSize: "22px",
  backgroundColor: "#0A0A23",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "300px"
};
