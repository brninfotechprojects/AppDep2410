import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  let navigate = useNavigate();

  let storeObj = useSelector((store) => {
    return store;
  });

  let onDeleteProfile = async () => {
    let url = `http://localhost:4567/deleteProfile?email=${storeObj.loginDetails.email}`;

    let reqOptions = {
      method: "DELETE",
    };

    let JSONData = await fetch(url, reqOptions);

    let JSOData = await JSONData.json();

    alert(JSOData.msg);

    if (JSOData.status == "success") {
      navigate("/");
    }
  };

  return (
    <div>
      <TopNavigation />
      <h1>Dashboard</h1>

      <h2>First Name:{storeObj.loginDetails.firstName}</h2>
      <h2>Last Name:{storeObj.loginDetails.lastName}</h2>
      <button
        onClick={() => {
          onDeleteProfile();
        }}
      >
        Delete Profile
      </button>
      <img
        src={`http://localhost:4567/${storeObj.loginDetails.profilePic}`}
      ></img>
    </div>
  );
}

export default Dashboard;
