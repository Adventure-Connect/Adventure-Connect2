import React from "react";
import { useNavigate } from "react-router";
import '../styles/AccountMgmt.css';

const AccountMgmt = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/account/password")
  }

  return (
    <div className="account-mgmt">
      <h1>Account management</h1>
      <h2>Change your password</h2>
      <label htmlFor="email">Enter your email to change your password:</label>
      <br />
      <input type="email" name="email" id="email" placeholder="ex: abc@123.com" />

      <p>(If you change your password, you will automatically be signed out from your session.)</p>
      <button type="submit" onClick={handleClick}>Change password</button>
    </div>
  )
}

export default AccountMgmt;