import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EntryPage from "./pages/EntryPage";
import ExitPage from "./pages/ExitPage";
import ParkingLotView from "./pages/ParkingLotView";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ParkingProvider>
          <Layout>
            <Routes>
              {/* PUBLIC ROUTE */}
              <Route path="/" element={<Home />} />

              {/* AFTER LOGIN ROUTES */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/entry" element={<EntryPage />} />
              <Route path="/exit" element={<ExitPage />} />
              <Route path="/parking-view" element={<ParkingLotView />} />
            </Routes>
          </Layout>
        </ParkingProvider>
      </AuthProvider>
    </Router>
  );
}
