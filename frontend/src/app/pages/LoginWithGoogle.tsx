// App.tsx
import React from 'react';
import Button from '../components/Button';
import axios from "axios";
import { setAuthUser, setIsAuthenticated } from "../appSlice";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import GoogleButton from "react-google-button";

const LoginWithGoogle: React.FC = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const fetchAuthUser = async () => {
    const response = await axios
      .get("http://localhost:5000/api/v1/auth/user", { withCredentials: true })
      .catch((err) => {
        console.log("Not properly authenticated");
        dispatch(setIsAuthenticated(false));
        dispatch(setAuthUser(null));
        history.push("/login/error");
      });

    if (response && response.data) {
      console.log("User: ", response.data);
      dispatch(setIsAuthenticated(true));
      dispatch(setAuthUser(response.data));
      history.push("/welcome");
    }
  };

    const redirectToGoogleSSO = async () => {
      let timer: NodeJS.Timeout | null = null;
      const googleLoginURL = "http://localhost:5000/api/v1/login/google";
      const newWindow = window.open(
        googleLoginURL,
        "_blank",
        "width=500,height=600"
      );
  
      if (newWindow) {
        timer = setInterval(() => {
          if (newWindow.closed) {
            console.log("Yay we're authenticated");
            fetchAuthUser();
            if (timer) clearInterval(timer);
          }
        }, 500);
      }
    };

  return (
    <div>
      <GoogleButton onClick={redirectToGoogleSSO}>Default Button</GoogleButton>
      <Button onClick={() => history.push("/login")}>Return Login</Button>
    </div>
  );
};

export default LoginWithGoogle;
