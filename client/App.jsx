import React, { useState, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserSpecific from "./components/UserSpecific.jsx";
import SettingsBar from "./components/Settings.jsx";
import EditProfile from "./components/EditProfile.jsx";
import AccountInterests from "./components/AccountInterests.jsx";
import AccountMgmt from "./components/AccountMgmt.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import OTP from "./components/OTP.jsx";
import Matches from "./components/Matches.jsx";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
export const RecoveryContext = createContext();
import "./styles.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  return (

    <div>
      <RecoveryContext.Provider value={{ otp, setOTP, email, setEmail }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route index element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/settings" element={<SettingsBar />} />
            <Route path="/account" element={<EditProfile />} />
            <Route path="/account/interests" element={<AccountInterests />} />
            <Route path="/account/management" element={<AccountMgmt />} />
            <Route path="/account/password" element={<ChangePassword />} />
            <Route
              path="*"
              element={<div>404 Error. This page was not found</div>}
            />
            <Route path="/userspecific" element={<UserSpecific />} />
            <Route path="/imageupload" element={<ImageUpload />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </RecoveryContext.Provider>
    </div>
  );
};

export default App;
