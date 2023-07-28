import React from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

// sidebar data to map through goes here
const sidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    cName: 'nav-text'
  },
  {
    title: "See My Matches",
    path: "/matches",
    cName: 'nav-text'
  },
  {
    title: "Edit Profile",
    path: "/account",
    cName: 'nav-text'
  },
  {
    title: "Interests",
    path: "/interests",
    cName: 'nav-text'
  },
  {
    title: "Account Management",
    path: "/account/management",
    cName: 'nav-text'
  }
];

export default sidebarData;

// export default function SettingsBar() {
//   // hooks go here

//   return (
//     <>
//       <ul>
//         {sidebarData.map((item) => (
//           <li key={item.path}>
//             <Link to={item.path}>{item.title}</Link>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
