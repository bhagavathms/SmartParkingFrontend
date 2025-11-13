import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Mount the main App component into the root div (index.html)
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
