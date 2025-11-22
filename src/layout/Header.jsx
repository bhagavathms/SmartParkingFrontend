import React from "react";
import { Link } from "react-router-dom";


export default function Header({
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onLogout,
}) {
  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="./assets/logo.png" alt="logo" style={{ width: "40px" }} />
      </div>

      <h2 style={{ flex: 1, textAlign: "center", margin: 0 }}>
        Smart Parking
      </h2>

      <div>
        {!isLoggedIn ? (
          <>
            <button style={btnStyle} onClick={onLoginClick}>Login</button>
            <button style={btnStyle} onClick={onSignupClick}>Signup</button>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={dashboardLink}>
              Dashboard
            </Link>
            <button style={btnStyle} onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#0A0A23",
  padding: "12px 25px",
  color: "white",
};

const btnStyle = {
  marginLeft: "10px",
  padding: "8px 15px",
  backgroundColor: "white",
  color: "#0A0A23",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const dashboardLink = {
  color: "white",
  textDecoration: "none",
  marginRight: "15px",
  fontWeight: "bold",
};
