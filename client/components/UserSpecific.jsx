import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../styles/UserSpecific.css";


const UserSpecific = () => {
  const [cookies, setCookie] = useCookies();
  const location = useLocation();
  console.log(location);
  console.log(`this is location.state.email: ${location.state.email}`);
  console.log("this is the current email", cookies.currentEmail);

  const [userPhotos, setUserPhotos] = useState([]);

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

  const getUserPhotos = async () => {
    const userPhotos = await axios.get(
      `http://localhost:3000/api/getImages/${location.state.email}`
    );
    console.log(userPhotos.data);
    setUserPhotos(userPhotos.data);
  };

  useEffect(() => {
    getUserPhotos();
  }, []);

  const renderPhotos = userPhotos.map((elem) => {
    return <img className="user-images" src={elem.image} />;
  });

  return (
    <div className="user-specific-container">
      <div className="user-specific-name">{location.state.name}</div>
      <div className="user-specific-email">{location.state.email}</div>
      <div className="user-specific-bio">{location.state.bio}</div>
      <div className="user-specific-grid">{renderPhotos}</div>
      <button className="user-specific-btn" onClick={handleClick}>
        Connect with this User
      </button>
    </div>
  );
};

export default UserSpecific;
