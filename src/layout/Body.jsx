import React from "react";

export default function Body({ children }) {
  return (
    <main style={bodyStyle}>
      {children}
    </main>
  );
}

const bodyStyle = {
  minHeight: "80vh",
  padding: "30px",
  backgroundColor: "#f5f5f5",
};
