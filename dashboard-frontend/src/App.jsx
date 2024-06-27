import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./components/Login";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Mocking the API response with sample data
    const sampleData = {
      data: {
        videos: [
          {
            id: "123456",
            title: "Sample Video 1",
            video_description: "Description of sample video 1",
            duration: 120,
            cover_image_url: "https://example.com/video1.jpg",
            create_time: 1629456000,
            embed_link: "https://www.tiktok.com/@user_id/video/123456",
          },
          {
            id: "789012",
            title: "Sample Video 2",
            video_description: "Description of sample video 2",
            duration: 90,
            cover_image_url: "https://example.com/video2.jpg",
            create_time: 1629542400,
            embed_link: "https://www.tiktok.com/@user_id/video/789012",
          },
        ],
      },
      error: {
        code: "ok",
        message: "",
        log_id: "20220829194722CBE87ED59D524E727021",
      },
    };

    // Setting the sample data as videos
    setVideos(sampleData.data.videos);
  }, []);

  const handleLoginSuccess = (accessToken, refreshToken, profile) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setProfile(profile);
    setIsLoggedIn(true);
  };

  const handleObtainNewToken = (newAccessToken) => {
    setAccessToken(newAccessToken);
  };

  return (
    <div className="App">
      <Sidebar profile={profile} />
      <Header />
      <Dashboard videos={videos} />
      <Login
        onLoginSuccess={handleLoginSuccess}
        onObtainNewToken={handleObtainNewToken}
        isLoggedIn={isLoggedIn}
        accessToken={accessToken}
        refreshToken={refreshToken}
      />
    </div>
  );
};

export default App;
