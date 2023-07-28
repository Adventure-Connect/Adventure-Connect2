import React from "react";
import "../styles/ProfileCard.css";
import { useNavigate } from "react-router-dom";

function ProfileCard({ profilePhoto, name, bio, interests, email }) {
  const nav = useNavigate();

  const handleClick = () => {
    nav("/userspecific", { state: { email, name, bio } });
  };

  return (
    <div className="profileCards">
      <img className="carousel-img" src={profilePhoto} />
      <div className="user-name">{name}</div>
      <div className="bio">{bio}</div>
      <div className="interests">{interests}</div>
      <button className="profile-btn" onClick={handleClick}>
        View More Info
      </button>
    </div>
  );
}

export default ProfileCard;
