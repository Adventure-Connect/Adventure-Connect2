import React, {useState} from "react";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    email: "renee.toscan@outlook.com",
    name: "ex: Michael Fish",
    location: 12345,
    bio: "Tell us a bit more about yourself!"
  })
  const updateProfile = async () => {
    console.log("updateProfile firing");
    // const userInfo = {
    //   email: "renee.toscan@outlook.com",
    //   name: "Renee Toscan",
    //   location: 95117,
    //   bio: "My name is Rod and I like to party",
    // };

    try {
      console.log(userInfo);
      // await fetch("http://localhost:3000/api/account", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userInfo),
      // });
    } catch (err) {
      console.log("an error occurred");
    }
  };

  return (
    <>
      <h1>Edit Profile</h1>
      <p>This information will appear on your public profile</p>

      <h3>Name (required)</h3>
      <input type="text" name="name" id="name" placeholder="asdfasdf" />

      <h3>Your location (required)</h3>
      <input
        type="text"
        name="zip code"
        id="zip-code"
        placeholder="ex: 12345"
      />

      <h3>Bio</h3>
      <textarea
        name="bio"
        id="bio"
        cols="30"
        rows="10"
        placeholder="Tell us a bit about yourself!"
      ></textarea>
      <button onClick={updateProfile}>Update Profile</button>
    </>
  );
};

export default UserProfile;
