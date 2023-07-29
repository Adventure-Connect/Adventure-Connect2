import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import sidebarData from "./Settings";
import "../styles/Navbar.css";
import { IconContext } from "react-icons";
import { useCookies } from "react-cookie";
import Notification from "./Notification";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [cookies, setCookie] = useCookies();
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="title-menu">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
            <h1>Adventure Connect</h1>

          {cookies.zipCode ? <Notification /> : null}
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {sidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
