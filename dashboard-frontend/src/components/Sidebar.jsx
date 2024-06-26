// src/Sidebar.js
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaMapLocation } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import "./Sidebar.css";
import logo from "../assets/spotify-scrapped.png";

const Sidebar = () => {
  const profilePictureUrl = "https://via.placeholder.com/150"; // Replace this URL with the actual profile picture URL
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="sidebar">
      <div className="profile-picture-container">
        <img
          src={profilePictureUrl}
          alt="Profile"
          className="profile-picture"
        />
      </div>
      <h2>Name Placeholder</h2>
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
      <img src={logo} alt="TikTok Logo" className="logo" />
    </div>
  );
};

export default Sidebar;
