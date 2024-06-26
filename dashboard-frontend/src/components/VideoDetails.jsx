// src/VideoDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/videos/${id}`)
      .then((response) => response.json())
      .then((data) => setVideo(data));
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{video.originalname}</h1>
      <p>Uploaded on: {new Date(video.uploadDate).toLocaleDateString()}</p>
      <p>
        Duration: {Math.floor(video.duration / 60)}:
        {video.duration % 60 < 10 ? "0" : ""}
        {video.duration % 60} minutes
      </p>
      {/* Add more detailed analytics here */}
    </div>
  );
};

export default VideoDetails;
