import React, { useState, useEffect } from "react";
// import Carousel from "./Carousel"
// import CarouselItem from "./CarouselItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import testImg from "../images/pika.jpg";
import "../styles/Dashboard.css";
import ProfileCard from "./ProfileCard";
import Notification from "./Notification";
import { useCookies } from "react-cookie";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Dashboard = () => {
  const [cookies, setCookie] = useCookies();
  const [usersArr, setUsersArr] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    console.log("this is the current interest", cookies.currentInterests);
    setLoading(true);
    const users = await axios.get(
      `http://localhost:3000/api/api/getUsers/${cookies.zipCode}`
    );
    console.log(users.data);
    setUsersArr(users.data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const renderArr = usersArr.map((elem) => {
    const interests = elem.interests.map((interest) => {
      return <div className="interest">{interest}</div>;
    });

    if (cookies.currentEmail !== elem.email) {
      return (
        <ProfileCard
          profilePhoto={elem.profilePhoto}
          name={elem.name}
          bio={elem.bio}
          interests={interests}
          email={elem.email}
        />
      );
    }
  });

  return (
    <div className="dashboard-container">
      {loading ? (
        <HashLoader className="loader" color={"black"} size={70} />
      ) : (
        <Carousel
          className="carousel-container"
          responsive={responsive}
          containerClass="container"
          swipeable={false}
          draggable={false}
          // showDots={true}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
        >
          {renderArr}
        </Carousel>
      )}
    </div>
  );
};

export default Dashboard;
