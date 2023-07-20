import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { RecoveryContext } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState();
  const [loginError, setLoginError] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [userEmail, setUserEmail] = useState("");
  const { setOTP, setEmail } = useContext(RecoveryContext);

  const sendOtp = async () => {
    if (userEmail) {
      try {
        const data = await fetch(
          `http://localhost:8080/api/check_email?email=${userEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await data.json();
        console.log(json);
        if (json.user) {
          const OTP = Math.floor(Math.random() * 9000 + 1000);
          console.log(OTP);
          setOTP(OTP);
          setEmail(userEmail);

          try {
            await fetch(`http://localhost:8080/api/send_email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                OTP: OTP,
                recipient_email: userEmail,
              }),
            });
            navigate("/otp");
          } catch (err) {
            alert("User with this email does not exist!");
            console.log(response.data.message);
          }
        }
      } catch (err) {
        alert("Please enter your email");
      }
    }
  };

  if (authenticated) {
    return navigate("/dashboard", {
      state: { currentUser: currentUser, authenticated: authenticated },
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credential = {
      email: userEmail,
      password: password,
    };
    try {
      const data = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
      });
      const json = await data.json();
      setAuthenticated(true);
      navigate("/dashboard", {
        state: { currentUser: currentUser, authenticated: authenticated },
      });
    } catch (err) {
      setAuthenticated(false);
      setLoginError(true);
    }
  };

  return (
    <div>
      <h1>
        Adventure<br></br>Connect
      </h1>
      <h2>Find Friends Outdoors</h2>
      <div id="login_container">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={(e) => setUserEmail(e.target.value)} />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {loginError && (
            <p style={{ color: "red" }}>
              Invalid login information. Please try again or{" "}
              <a href="/signup">sign up</a>.
            </p>
          )}
          <div>
            <button className="btn" onClick={() => navigate("/signup")}>
              Register
            </button>
            <button className="btn" type="submit">
              Login
            </button>
          </div>
        </form>
        <a href="#" onClick={() => sendOtp()}>
          Forgot your passowrd?
        </a>
      </div>
    </div>
  );
};

export default Login;
