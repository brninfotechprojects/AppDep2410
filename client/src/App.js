import logo from "./logo.svg";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import Leaves from "./components/Leaves";
import Requests from "./components/Requests";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/tasks" element={<Tasks />}></Route>
        <Route path="/leaves" element={<Leaves />}></Route>
        <Route path="/requests" element={<Requests />}></Route>
        <Route path="/editProfile" element={<EditProfile />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
