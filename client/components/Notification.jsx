import React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "../styles/Notification.css";
import IconNotification from "../images/notification (1).png";
import axios from "axios";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

function Notification() {
  const [cookies, setCookie] = useCookies();
  const [requests, setRequests] = useState([]);
  const [numRequest, setNumRequest] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const getRequests = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/friendRequest/${cookies.currentEmail}`
    );
    console.log("this is the resposne", response.data.data);
    setRequests([...response.data.data]);
    setNumRequest(response.data.data.length);
  };

  const handleClick = () => {
    if (numRequest > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleAcceptClick = async (name) => {
    const response = await axios.post(`http://localhost:3000/api/accept`, {
      currentUser: cookies.currentEmail,
      name,
    });

    setRequests([...response.data.data]);
    setNumRequest(response.data.data.length);
  };

  useEffect(() => {
    getRequests();
  }, []);

  const requestRenderArr = requests.map((elem) => {
    console.log(requests);
    return (
      <div className="user-account">
        <img className="notification-img" src={elem.profilePhoto} />
        <div className="user-account-name">{elem.name}</div>
        <button
          className="accept-btn"
          onClick={() => {
            handleAcceptClick(elem.name);
          }}
        >
          Accept
        </button>
      </div>
    );
  });

  return (
    <div className="notification-container">
      <div onClick={handleClick} className="icon-container">
        {/* <img className="icon-img" src={IconNotification} /> */}
        <NotificationsActiveIcon fontSize="large" className="icon-img" />
        {numRequest ? <div className="num-request">{numRequest}</div> : null}
      </div>
      {isOpen && numRequest ? (
        <div className="user-container">{requestRenderArr}</div>
      ) : null}
    </div>
  );
}

export default Notification;