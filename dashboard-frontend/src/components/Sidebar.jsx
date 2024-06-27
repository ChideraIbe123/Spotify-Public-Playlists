import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaMapLocation } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import "./Sidebar.css";
import logo from "../assets/spotify-scrapped.png";
import Login from "./Login";

const Sidebar = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="sidebar">
      <div className="profile-picture-container">
        {profile && profile.images && profile.images.length > 0 ? (
          <img
            src={profile.images.url}
            alt={profile.display_name}
            className="profile-picture"
          />
        ) : (
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-picture"
          />
        )}
      </div>
      <h2>{profile ? profile.display_name : "Name Placeholder"}</h2>
      <ul>
        <li
          className={activeTab === "Home" ? "active" : ""}
          onClick={() => setActiveTab("Home")}
        >
          <FaHome className="icon" />
          Dashboard
        </li>
        <li
          className={activeTab === "Analytics" ? "active" : ""}
          onClick={() => setActiveTab("Analytics")}
        >
          <GoGraph className="icon" />
          Analytics
        </li>
        <li
          className={activeTab === "Trends" ? "active" : ""}
          onClick={() => setActiveTab("Trends")}
        >
          <FaMapLocation className="icon" />
          Trends
        </li>
        <li
          className={activeTab === "Settings" ? "active" : ""}
          onClick={() => setActiveTab("Settings")}
        >
          <MdAccountCircle className="icon" />
          Settings
        </li>
      </ul>
      <Login></Login>
      <img src={logo} alt="TikTok Logo" className="logo" />
    </div>
  );
};

export default Sidebar;
