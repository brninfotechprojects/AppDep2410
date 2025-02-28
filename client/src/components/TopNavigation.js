import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function TopNavigation() {
  let navigate = useNavigate();

  let storeObj = useSelector((store) => {
    return store;
  });

  useEffect(() => {
    if (storeObj && storeObj.loginDetails && storeObj.loginDetails.email) {
    } else {
      navigate("/");
    }
  }, []);

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/editProfile">Edit Profile</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/leaves">Leaves</Link>
      <Link to="/requests">Requests</Link>
      <Link
        to="/"
        onClick={() => {
          localStorage.clear();
        }}
      >
        Signout
      </Link>
    </nav>
  );
}

export default TopNavigation;
