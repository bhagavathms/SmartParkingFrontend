import React from "react";

export default function Home({ setIsLoggedIn }) {
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>Welcome to Smart Parking</h1>
        <p style={subtitleStyle}>Login or Signup to continue</p>

        <div style={{ marginTop: "20px" }}>
          <button style={btnStyle} onClick={() => alert("Open login modal")}>
            Login
          </button>
          <button style={btnStyle} onClick={() => alert("Open signup modal")}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  backgroundImage: 'url("/images/home-bg.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const overlayStyle = {
  background: "rgba(0, 0, 0, 0.5)",
  padding: "40px",
  borderRadius: "10px",
  color: "white",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "2.5rem",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  marginBottom: "20px",
};

const btnStyle = {
  padding: "10px 20px",
  margin: "0 10px",
  fontSize: "1rem",
  backgroundColor: "white",
  color: "#0A0A23",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
