import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/UserSpecific.css";

const UserSpecific = () => {
  const location = useLocation();
  console.log(location);
  console.log(location.state.email);

  const [userPhotos, setUserPhotos] = useState([]);

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
    <div>
      <div>{location.state.name}</div>
      <div>{renderPhotos}</div>
    </div>
  );
};

export default UserSpecific;
