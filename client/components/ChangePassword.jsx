import React from "react";
import '../styles/ChangePassword.css'

const ChangePassword = () => {

  return (
    <div className="change-password">
      <h1>Change Your Password</h1>
      <p>Password must be at least 6 characters including one special chracter</p>
      <label htmlFor="Current Password"></label>
      <input type="text" name="currentPassword" id="currentPassword" placeholder="Current Password" />
      <label htmlFor="New Password"></label>
      <input type="text" name="newPassword" id="newPassword" placeholder="New Password"/>
      <label htmlFor="Confirm New Password"></label>
      <input type="text" name="confirmPassword" id="confirmPassword" placeholder="Retype New Password" />

      <button>Change Password</button>
    </div>
  )
}

export default ChangePassword;