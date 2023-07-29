import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import { useCookies } from "react-cookie";
import "../styles/Login.css";
import loginImg from "../images/pexels-allan-mas-5384632.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [userEmail, setUserEmail] = useState("");
  const { setOTP, setEmail } = useContext(RecoveryContext);
  const [cookies, setCookie] = useCookies();

  //checks to see if user credentials have been verified
  if (authenticated) {
    return navigate("/dashboard", {
      state: { currentUser: currentUser, authenticated: authenticated },
    });
  }
  // const verifyAuthentication = () => {
  //   if (authenticated) {
  //     navigate("/userprofile", {
  //       state: { currentUser: currentUser, authenticated: authenticated },
  //     });
  //   } else {
  //     console.log("user credentials not accepted");
  //   }
  // };

  //sends request to backend to verify user credentials
  const handleSubmit = async (e) => {
    console.log("handleSubmit firing");
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
      if (json.message === "Invalid credentials!") {
        setLoginError(true);
      } else if (json.message === "Login successful!") {
        setAuthenticated(true);
        navigate("/dashboard", {
          state: { currentUser: currentUser, authenticated: authenticated },
        });
      }
    } catch (err) {
      setAuthenticated(false);
      setLoginError(true);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        background: `url('${loginImg}')`,
        backgroundSize: "cover",
      }}
    >
      <div className="image-overlay-container">
        <h1 className="heading">
          Adventure<br></br>Connect
        </h1>
        <div className="flex-container">
          <h2 className="second-heading">Find Friends Outdoors</h2>
          <div>
            <form className="form-container" onSubmit={handleSubmit}>
              <p>Email</p>
              <input
                type="text"
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <p>Password</p>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {loginError && (
                <p style={{ color: "red" }}>
                  Invalid login information. Please try again or{" "}
                  <a href="/signup">sign up</a>.
                </p>
              )}
              <div className="button-container">
                <button className="btn" onClick={() => navigate("/signup")}>
                  Register
                </button>
                <button className="btn" type="submit" onClick={handleSubmit}>
                  Login
                </button>
              </div>

              <a href="#" onClick={() => sendOtp()}>
                Forgot your password?
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
