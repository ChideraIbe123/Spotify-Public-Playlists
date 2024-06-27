// src/Dashboard.js
import React from "react";
import "./Dashboard.css";

const Dashboard = ({ videos }) => {
  return (
    <div className="dashboard">
      <h2>Public playlists for you</h2>
      <div className="video-container">
        <div className="video-grid">
          {videos.map((video) => (
            <div className="video-card" key={video.id}>
              <div className="video-thumbnail-container">
                <img
                  src={video.cover_image_url}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-overlay">
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>
                      Uploaded on:{" "}
                      {new Date(video.create_time * 1000).toLocaleDateString()}
                    </p>
                    <p>
                      Duration: {Math.floor(video.duration / 60)}:
                      {video.duration % 60 < 10 ? "0" : ""}
                      {video.duration % 60} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
