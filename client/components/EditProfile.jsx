import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const UserProfile = () => {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [userLocation, setUserLocation] = useState();
  const [userBio, setUserBio] = useState();
  const [cookies, setCookie] = useCookies();
  const [status, setStatus] = useState();

  useEffect(() => {
    setEmail(cookies.currentEmail);
  }, [userBio]);

  const updateProfile = async () => {
    const userInfo = {
      email: email,
      name: userName,
      location: userLocation,
      bio: userBio,
    };

    try {
      const data = await fetch("http://localhost:3000/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const json = await data.json();
      console.log(json);
      if (cookies.currentEmail === undefined) {
        setStatus("Error occurred. Please be sure you're logged in.");
      } else {
        setStatus(json.message);
      }
    } catch (err) {
      console.log("an error occurred");
    }
  };

  return (
    <>
      <h1>Edit Profile</h1>
      <p>This information will appear on your public profile</p>

      <h3>Name (required)</h3>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="ex: Michael Fish"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />

      <h3>Your location (required)</h3>
      <input
        type="text"
        name="zip code"
        id="zip-code"
        placeholder="ex: 12345"
        onChange={(event) => {
          setUserLocation(event.target.value);
        }}
      />

      <h3>Bio</h3>
      <textarea
        name="bio"
        id="bio"
        cols="30"
        rows="10"
        placeholder="Tell us a bit more about yourself!"
        onChange={(event) => {
          setUserBio(event.target.value);
        }}
      ></textarea>
      {status && <p>{status}</p>}
      <button onClick={updateProfile}>Update Profile</button>
    </>
  );
};

export default UserProfile;
