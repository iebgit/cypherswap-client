import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar } from '@material-ui/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "./NavBar.css";
import {
    Text,
    Button, 
    FramePentagon,
    FrameCorners,
    FrameBox,} from '@arwes/core'
import decode from 'jwt-decode';

import Logo from '../../images/logo.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    navigate('/auth');
    setUser(null);
  };

  const userAccount = (username) => {
    dispatch({ type: actionType.FETCH_BY_CREATOR })
    navigate(`/creators/${username}`)
  }
  const toSwap = () => {
    navigate(`/swap`)
  }

  const toHome = () => {
    navigate(`/home`)
  }

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <>
    <AppBar className={classes.appBar} position="static" color="inherit">
        <Toolbar className={classes.toolbar}>
      <Link to="/home" className={classes.brandContainer} onClick={()=>toHome()}>
      &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className=" mt-4 w-7 h-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

        <Text className={classes.heading} >&nbsp;Home</Text>
      </Link>
      {user?.result ? 
        <Link to="/swap" className={classes.brandContainer} onClick={()=>toSwap()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="ml-5 mr-2 mt-4 w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
  
          <Text className={classes.heading}>Swap</Text>
        </Link>:<></>
    }
    
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
            <>
            <Link to={`/creators/${user?.result.name}`} className={classes.profile} onClick={()=>userAccount(user?.result.name)}>
                <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>
                {user?.result.name.charAt(0)}
                </Avatar>
            </Link>
             <Button FrameComponent={FramePentagon} palette="secondary" onClick={logout}>Logout</Button>

            </>
         
        ) : (
            <Link to="/auth">
                <Button
                    FrameComponent={FramePentagon}
                    palette="secondary"
                    animator={true}
                  >
                   Sign In
                  </Button>
            </Link>
        )}
      </Toolbar>
     
    </AppBar>
     <hr/>
     </>
  );
};

export default Navbar;