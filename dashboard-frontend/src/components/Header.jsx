// src/Header.js
import React from "react";
import "./Header.css";

const Header = () => {
  const handleUploadClick = () => {
    // Implement your upload video logic here
    alert("Upload Video clicked!");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h3>Dashboard</h3>
        <p>Welcome to the Spotify Dashboard</p>
      </div>
      <button className="upload-button" onClick={handleUploadClick}>
        Filter
      </button>
    </header>
  );
};

export default Header;
