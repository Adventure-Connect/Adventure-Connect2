import React from "react";
import { Link } from "react-router-dom";

// sidebar data to map through goes here
const sidebarData = [
  {
    title: "Edit Profile",
    path: "/account",
  },
  {
    title: "Interests",
    path: "/account/interests",
  },
  {
    title: "Account Management",
    path: "/account/management",
  },
];

export default function SettingsBar() {
  // hooks go here

  return (
    <>
      <ul>
        {sidebarData.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
