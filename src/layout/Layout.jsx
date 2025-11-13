import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";
// import LoginModal from "../ui/LoginModal";
// import SignupModal from "../ui/SignupModal";

export default function Layout({ children, isLoggedIn, setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogout={() => {
          setIsLoggedIn(false);
          window.location.href = "/";
        }}
      />

      <Body>{children}</Body>

      <Footer />

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setIsLoggedIn(true);
            window.location.href = "/dashboard";
          }}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSuccess={() => {
            setShowSignup(false);
            setIsLoggedIn(true);
            window.location.href = "/dashboard";
          }}
        />
      )}
    </>
  );
}
