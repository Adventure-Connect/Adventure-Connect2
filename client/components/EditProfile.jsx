import React from "react";

const UserProfile = () => {
  return (
    <>
      <h1>Edit Profile</h1>
      <p>This information will appear on your public profile</p>

      <h3>Name (required)</h3>
      <input type="text" name="name" id="name" />

      <h3>Your location</h3>
      <p>Example zip code</p>
      {/* Put the designated route here */}
      <a href="/">Edit address</a>

      <h3>Bio</h3>
      <textarea name="bio" id="bio" cols="30" rows="10"></textarea>
    </>
  );
};

export default UserProfile;
