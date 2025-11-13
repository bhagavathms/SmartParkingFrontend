import React from "react";

export default function Footer() {
  return (
    <footer style={footerStyle}>
      © 2025 Smart Parking System — All Rights Reserved
    </footer>
  );
}

const footerStyle = {
  textAlign: "center",
  padding: "15px",
  backgroundColor: "#0A0A23",
  color: "white",
  marginTop: "30px",
};
