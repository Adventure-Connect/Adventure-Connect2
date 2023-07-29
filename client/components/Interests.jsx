import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "../styles/Interests.css";
import Select from "react-select";

const activities = [
  {
    label: "Backpacking",
    value: "Backpacking",
    color: "#2c2b27",
    fontColor: "#f0f0f0",
  },
  {
    label: "Camping",
    value: "Camping",
    color: "#877767 ",
    fontColor: "#f0f0f0",
  },
  {
    label: "Climbing",
    value: "Climbing",
    color: "#b98d5c",
    fontColor: "#f0f0f0",
  },
  { label: "Hiking", value: "Hiking", color: "#2c2b27", fontColor: "#f0f0f0" },
  {
    label: "Mountain Biking",
    value: "Mountain Biking",
    color: "#959a86",
    fontColor: "#f0f0f0",
  },
  {
    label: "Rafting",
    value: "Rafting",
    color: "#2c2b27",
    fontColor: "#f0f0f0",
  },
  {
    label: "Road Cycling",
    value: "Road Cycling",
    color: "#2c2b27",
    fontColor: "#f0f0f0",
  },
  {
    label: "Roller Skating",
    value: "Roller Skating",
    color: "#2c2b27",
    fontColor: "#f0f0f0",
  },
  {
    label: "Trail Running",
    value: "Trail Running",
    color: "#2c2b27",
    fontColor: "#f0f0f0",
  },
];

const Interests = () => {
  const [cookies, setCookie] = useCookies();
  const [interests, setInterests] = useState();
  const colors = ["#877767", "#b98d5c"];

  useEffect(() => {
    displayCurrentInterests();
  }, []);

  const displayCurrentInterests = async () => {
    console.log("displayInterests firing");
    try {
      const data = await fetch(
        `http://localhost:3000/api/interests?email=${encodeURIComponent(
          cookies.currentEmail
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await data.json();

      setInterests(json);
    } catch (err) {
      console.log("an error occurred");
    }
  };

  return (
    <div className="interests">
      <h1>Interests</h1>
      <h2>Your interests</h2>
      <div className="current-interests">
        <ul>
          {interests &&
            interests.map((interest) => (
              <li key={interest} style={{ backgroundColor: colors[1] }}>
                {interest}
              </li>
            ))}
        </ul>
      </div>
      <h2>Add more interests</h2>
      <p>
        Add more interests by searching by category or searching by keyword!
      </p>
      <Select
        options={activities}
        onChange={(opt) => {
          const temp = interestLabels.slice();
          const interestsTemp = interests.slice();
          temp.push(<label key={opt.value.toLowerCase()}>{opt.value}</label>);
          interestsTemp.push(opt.value);
          setInterestLabels(temp);
          setInterests(interestsTemp);
          console.log(interests);
        }}
      />
      <button>Save Changes</button>
    </div>
  );
};

export default Interests;
