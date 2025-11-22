import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

export default function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate("/dashboard");
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    navigate("/dashboard");
  };

  return (
    <>
      <Header
        isLoggedIn={isAuthenticated}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogout={handleLogout}
      />

      <Body>{children}</Body>

      <Footer />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
