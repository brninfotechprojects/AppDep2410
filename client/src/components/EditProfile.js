import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TopNavigation from "./TopNavigation";
import { useSelector } from "react-redux";

function EditProfile() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let ageInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let mobileNoInputRef = useRef();
  let profilePicInputRef = useRef();

  let loginDetails = useSelector((store) => {
    return store.loginDetails;
  });

  useEffect(() => {
    console.log("inside edit profile useeffect");
    console.log(loginDetails);

    firstNameInputRef.current.value = loginDetails.firstName;
    lastNameInputRef.current.value = loginDetails.lastName;
    ageInputRef.current.value = loginDetails.age;
    emailInputRef.current.value = loginDetails.email;
    mobileNoInputRef.current.value = loginDetails.mobileNo;
    setSelectedPicPath(`/${loginDetails.profilePic}`);
  }, []);

  let [selectedPicPath, setSelectedPicPath] = useState("./images/no-pic.png");

  let onUpdateUsingFormData = async () => {
    let dataToSend = new FormData();
    dataToSend.append("firstName", firstNameInputRef.current.value);
    dataToSend.append("lastName", lastNameInputRef.current.value);
    dataToSend.append("age", ageInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("mobileNo", mobileNoInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptions = {
      method: "PATCH",
      body: dataToSend,
    };

    let JSONData = await fetch("/updateProfile", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  };

  return (
    <div className="App">
      <TopNavigation />
      <form>
        <h2>Edit Profile</h2>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Age</label>
          <input ref={ageInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef} readOnly></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Mobile No.</label>
          <input ref={mobileNoInputRef}></input>
        </div>
        <div>
          <label>Profile Pic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            onChange={(ele) => {
              console.log(ele);
              let selectedURLPicPath = URL.createObjectURL(ele.target.files[0]);
              console.log(selectedURLPicPath);

              setSelectedPicPath(selectedURLPicPath);
            }}
          ></input>
          <br></br>
          <img src={selectedPicPath} className="profilePicPreview"></img>
        </div>
        <div>
          {/* <button
            type="button"
            onClick={() => {
              onSingupUsingJSON();
            }}
          >
            Signup - JSON
          </button>
          <button
            type="button"
            onClick={() => {
              onSingupUsingJSON();
            }}
          >
            Signup - URLE
          </button> */}
          <button
            type="button"
            onClick={() => {
              onUpdateUsingFormData();
            }}
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
