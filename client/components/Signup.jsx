import React, { useEffect, useState, history } from "react";
import Select from "react-select";
import { Navigate } from "react-router-dom";

const activities = [
  { label: "Backpacking", value: "Backpacking" },
  { label: "Camping", value: "Camping" },
  { label: "Climbing", value: "Climbing" },
  { label: "Hiking", value: "Hiking" },
  { label: "Mountain Biking", value: "Mountain Biking" },
  { label: "Rafting", value: "Rafting" },
  { label: "Road Cycling", value: "Road Cycling" },
  { label: "Roller Skating", value: "Roller Skating" },
  { label: "Trail Running", value: "Trail Running" },
];

const Signup = () => {
  const [interestLabels, setInterestLabels] = useState([]);
  const [interests, setInterests] = useState([]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [zipcode, setZipcode] = useState();
  const [bio, setBio] = useState();
  const [redirect, setRedirect] = useState(false);

  //for navigating to login after successful submission of create user

  //create a conditional, to navigate to / if redirect is false
  if (redirect === true) {
    return <Navigate to="/" />;
  }

  // const [ images, setImages ] = useState([]);

  // const handleImageFiles = e => {
  //     const temp = images;
  //     temp.push(e.target.files[0]);
  //     setImages(temp);
  //     console.log(images);
  // }
  const createUser = async (info) => {
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info),
      });

      //if the createNewUser request is successful, then initiate redirect
      if (response.ok) setRedirect(true);
    } catch (err) {
      alert(`An error has occurred! ${err.message}`);
      return err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      createUser({
        name: name,
        email: email,
        password: password,
        zipCode: zipcode,
        interests: interests,
        // images: images,
        bio: bio,
      });
    } catch (err) {
      return err;
    }
  };

  // const imageSelector = [];
  // for (let i = 0; i < 6; i++) {
  //     imageSelector.push(
  //         <div>
  //             <input type='file' id={`image${i}`} key={`image${i}`} accept='image/*' onChange={e => handleImageFiles(e)} style={{display: 'none'}}></input>
  //             <label htmlFor={`image${i}`} style={{color: 'lightgray', border: 'dashed', width:'90px', height: '90px', fontSize: '72px'}}>+</label>
  //         </div>
  //     )
  // }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            require="true"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="text"
            require="true"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            require="true"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Zipcode</label>
          <input
            type="text"
            require="true"
            onChange={(e) => setZipcode(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Photos</label>
          <div
            style={{
              display: "grid",
              gridTemplate: "1fr 1fr 1fr",
              textAlign: "center",
            }}
          >
            {/* {imageSelector} */}
          </div>
        </div>
        <div>
          <label>Interests</label>
          <Select
            options={activities}
            onChange={(opt) => {
              const temp = interestLabels.slice();
              const interestsTemp = interests.slice();
              temp.push(
                <label key={opt.value.toLowerCase()}>{opt.value}</label>
              );
              interestsTemp.push(opt.value);
              setInterestLabels(temp);
              setInterests(interestsTemp);
              console.log(interests);
            }}
          />
          <div id="interestBox">{interestLabels}</div>
        </div>
        <div>
          <label>Tell us more about yourself</label>
          <br></br>
          <input
            type="text"
            placeholder="Favorite outdoor memories
                    What are you looking for?"
            onChange={(e) => setBio(e.target.value)}
            style={{ height: "150px", width: "250px", textAlign: "top" }}
          ></input>
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
