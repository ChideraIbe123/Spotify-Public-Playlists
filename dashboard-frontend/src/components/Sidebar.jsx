import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaMapLocation } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import "./Sidebar.css";
import logo from "../assets/spotify-scrapped.png";
import Login from "./Login";
import account from "../assets/account.png";

const Sidebar = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="sidebar">
      <div className="profile-picture-container">
        {profile && profile.images && profile.images.length > 0 ? (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            className="profile-picture"
          />
        ) : (
          <img src={account} alt="Profile" className="profile-picture" />
        )}
      </div>
      <h2 className="name">
        {profile ? profile.display_name : "Name Placeholder"}
      </h2>

      <Login></Login>
      <img src={logo} alt="TikTok Logo" className="logo" />
    </div>
  );
};

export default Sidebar;
