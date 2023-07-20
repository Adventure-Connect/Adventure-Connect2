import React from "react";

const Header = () => {
  return (
    <span className="header">
      <h1>Adventure Connect</h1>
      <a href="/settings">Edit Settings</a>
      <a href="/matches">See my Matches</a>
      <img className="profilePic" src="" alt="" />
    </span>
  );
};

export default Header;
