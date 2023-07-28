import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import "../styles/Interests.css";

const Interests = () => {
  const [cookies, setCookie] = useCookies();
  const [interests, setInterests] = useState();
  const exampleInterests = ["hiking", "rollerskating"];
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
      <button>Save Changes</button>
    </div>
  );
};

export default Interests;
