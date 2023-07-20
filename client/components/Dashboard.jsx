import React from "react";
// import Carousel from "./Carousel"
// import CarouselItem from "./CarouselItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import testImg from "../images/pika.jpg";
import "../styles/Dashboard.css";

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
  return (
    <div>
      <Carousel className="carousel-container" responsive={responsive}>
        <div>
          <div>Item1</div>
          <img className="carousel-img" src={testImg} />
        </div>
        <div>
          <div>Item2</div>
          <img className="carousel-img" src={testImg} />
        </div>
        <div>
          <div>Item3</div>
          <img className="carousel-img" src={testImg} />
        </div>
        <div>
          <div>Item4</div>
          <img className="carousel-img" src={testImg} />
        </div>
        <div>
          <div>Item5</div>
          <img className="carousel-img" src={testImg} />
        </div>
        <div>
          <div>Item6</div>
          <img className="carousel-img" src={testImg} />
        </div>
      </Carousel>
    </div>
  );
};

export default Dashboard;
