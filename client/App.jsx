import React, { useState, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserSpecific from "./components/UserSpecific.jsx";
import SettingsBar from "./components/Settings.jsx";
import EditProfile from "./components/EditProfile.jsx";
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
import PrivateRoutes from "./utils/PrivateRoutes.js";
import Interests from "./components/Interests.jsx";

const App = () => {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  return (
    <>
      <RecoveryContext.Provider value={{ otp, setOTP, email, setEmail }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            //PrivateRoutes protects routes from users who are not logged in
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interests" element={<Interests />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/account" element={<EditProfile />} />
              <Route path="/account/management" element={<AccountMgmt />} />
              <Route path="/account/password" element={<ChangePassword />} />
              <Route path="/userspecific" element={<UserSpecific />} />
              <Route path="/settings" element={<SettingsBar />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/home" element={<Home />} />
            </Route>
            <Route index element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route
              path="*"
              element={<div>404 Error. This page was not found</div>}
            />
            <Route path="/imageupload" element={<ImageUpload />} />
            <Route path="/otp" element={<OTP />} />
          </Routes>
        </BrowserRouter>
      </RecoveryContext.Provider>
    </>
  );
};

export default App;

//account
