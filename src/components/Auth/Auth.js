import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Paper, Grid, Typography, Container } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Text,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
} from "@arwes/core";
import Icon from "./Icon";
import { signin, signup } from "../../actions/auth";
import { AUTH } from "../../constants/actionTypes";
import useStyles from "./styles";
import Input from "./Input";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
};

const SignUp = ({ address }) => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    console.log("address called: ", address);
    setForm({ ...form, address });
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(form, NavigationPreloadManager));
    } else {
      dispatch(signin(form, navigate));
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    console.log(result, token);

    try {
      dispatch({ type: AUTH, data: { result, token } });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () =>
    console.log("Google Sign In was unsuccessful. Try again later");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value, address });

  return (
    <Container component="main" maxWidth="xs">
      <FrameCorners
        palette="primary"
        cornerLength={22}
        hover
        className={classes.paper}
      >
        <Text as="h2">{isSignup ? "Sign up" : "Sign in"}</Text>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  autoFocus
                  half
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              type="email"
            />
            <input
              name="password"
              placeholder="Password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <input
                name="confirmPassword"
                placeholder="Repeat Password"
                onChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            FrameComponent={FrameBox}
            fullWidth
            variant="contained"
            palette="secondary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="564033717568-bu2nr1l9h31bhk9bff4pqbenvvoju3oq.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                palette="secondary"
                FrameComponent={FramePentagon}
                className={classes.googleButton}
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <div onClick={switchMode}>
                <Text>
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Text>
              </div>
            </Grid>
          </Grid>
        </form>
      </FrameCorners>
    </Container>
  );
};

export default SignUp;
