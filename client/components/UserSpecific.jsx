import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import axios from "axios";
import "../styles/UserSpecific.css";

const UserSpecific = () => {
  const [cookies, setCookie] = useCookies();
  const location = useLocation();
  // console.log("rerendered");
  // console.log("this is the location", location.state);
  // console.log(location.state.email);
  // console.log("this is the current email", cookies.currentEmail);

  const [userPhotos, setUserPhotos] = useState([]);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);

  const handleClick = async () => {
    const response = await axios.post(
      `http://localhost:3000/api/friendRequest`,
      {
        name: location.state.name,
        email: location.state.email,
        currentUserEmail: cookies.currentEmail,
      }
    );
  };

  const getUserPhotos = async (email) => {
    console.log("this is the email", email);
    const userPhotos = await axios.get(
      `http://localhost:3000/api/getImages/${email}`
    );
    console.log(userPhotos.data);
    setUserPhotos(userPhotos.data);
  };

  useEffect(() => {
    const setCookie = () => {
      Cookies.set("email", location.state.email, { expires: 7 }); // Set the cookie with a name, value, and optional expiration (in days)
      Cookies.set("name", location.state.name, { expires: 7 });
      Cookies.set("currentUserEmail", cookies.currentEmail, { expires: 7 });
      Cookies.set("bio", location.state.bio, { expires: 7 });
    };
    if (location.state) {
      setCookie();
      setEmail(location.state.email);
      setBio(location.state.bio);
      setName(location.state.name);
    } else {
      setEmail(cookies.email);
      setBio(cookies.bio);
      setName(cookies.name);
    }
    // getUserPhotos(email);
  }, []);

  useEffect(() => {
    if (email) {
      getUserPhotos(email);
    }
  }, [email]);

  const renderPhotos = userPhotos.map((elem) => {
    return <img className="user-images" src={elem.image} />;
  });

  return (
    <div className="user-specific-container">
      <div className="user-specific-name">{name}</div>
      <div className="user-specific-email">{email}</div>
      <div className="user-specific-bio">{bio}</div>
      <div className="user-specific-grid">{renderPhotos}</div>
      <button className="user-specific-btn" onClick={handleClick}>
        Connect with this User
      </button>
    </div>
  );
};

export default UserSpecific;
