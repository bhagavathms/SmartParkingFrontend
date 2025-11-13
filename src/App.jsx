import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
console.log("Layout Error ",Layout)
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard";
import EntryPage from "./pages/EntryPage";
import ExitPage from "./pages/ExitPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} />} />

          {/* AFTER LOGIN ROUTES */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entry" element={<EntryPage />} />
          <Route path="/exit" element={<ExitPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
