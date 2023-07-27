import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const UserProfile = () => {
  // const email = "renee.toscan@outlook.com";
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("ex: Michael Fish");
  const [userLocation, setUserLocation] = useState(12345);
  const [userBio, setUserBio] = useState("Tell us a bit more about yourself!");
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    setEmail(cookies.currentEmail);
    console.log(email);
  }, [userBio]);

  const updateProfile = async () => {
    console.log("updateProfile firing");
    // const userInfo = {
    //   email: "renee.toscan@outlook.com",
    //   name: "Renee Toscan",
    //   location: 95117,
    //   bio: "My name is Rod and I like to party",
    // };

    try {
      await fetch("http://localhost:3000/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
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
        placeholder={userName}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />

      <h3>Your location (required)</h3>
      <input
        type="text"
        name="zip code"
        id="zip-code"
        placeholder={userLocation}
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
        placeholder={userBio}
        onChange={(event) => {
          setUserBio(event.target.value);
        }}
      ></textarea>
      <button onClick={updateProfile}>Update Profile</button>
    </>
  );
};

export default UserProfile;
