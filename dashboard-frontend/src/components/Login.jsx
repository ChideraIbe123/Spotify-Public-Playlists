import React, { useEffect, useState } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Import the custom CSS

const Login = ({
  onLoginSuccess,
  onObtainNewToken,
  isLoggedIn,
  accessToken,
  refreshToken,
}) => {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    function getHashParams() {
      const hashParams = {};
      let e;
      const r = /([^&;=]+)=?([^&;]*)/g;
      const q = window.location.hash.substring(1);
      while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    const params = getHashParams();
    const access_token = params.access_token;
    const refresh_token = params.refresh_token;
    const error = params.error;

    if (error) {
    } else {
      if (access_token) {
        $.ajax({
          url: "https://api.spotify.com/v1/me",
          headers: {
            Authorization: "Bearer " + access_token,
          },
          success: function (response) {
            onLoginSuccess(access_token, refresh_token, response);
            fetchTopArtists(access_token);
            fetchTopTracks(access_token);
            getTopArtistsAndTracks(accessToken);
          },
          error: function () {},
        });
      }
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    const client_id = "4ffbe15a463d48fe8b04415783748083";
    const redirect_uri = "http://localhost:5174/callback";
    const scopes = "user-read-private user-read-email user-top-read";

    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  };

  const handleObtainNewToken = () => {
    if (refreshToken) {
      $.ajax({
        url: "/refresh_token",
        data: {
          refresh_token: refreshToken,
        },
        success: function (data) {
          onObtainNewToken(data.access_token);
        },
        error: function () {},
      });
    }
  };

  const fetchTopArtists = (accessToken) => {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/artists?limit=10",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      success: function (response) {
        setTopArtists(response.items);
      },
      error: function () {},
    });
  };

  const fetchTopTracks = (accessToken) => {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks?limit=10",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      success: function (response) {
        setTopTracks(response.items);
      },
      error: function () {},
    });
  };

  const getTopArtistsAndTracks = async (accessToken) => {
    try {
      const topArtists = await fetchTopArtists(accessToken);
      const topTracks = await fetchTopTracks(accessToken);

      // Convert the fetched data into a JSON object
      const jsonData = {
        topArtists: topArtists,
        topTracks: topTracks,
      };

      console.log("Top Artists and Tracks:", JSON.stringify(jsonData, null, 2));

      const response = await fetch("http://localhost:5000/generate-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Keywords generated:", responseData);
    } catch (error) {
      console.error("Error fetching top artists and tracks:", error);
    }
  };

  return (
    <div className="login-component">
      {!isLoggedIn ? (
        <div id="login">
          <button
            onClick={handleLogin}
            className="btn btn-primary spotify-green-button"
          >
            Log in with Spotify
          </button>
        </div>
      ) : (
        <div id="loggedin">
          <div id="oauth">
            <h2>OAuth Info</h2>
            <p>Access Token: {accessToken}</p>
            <p>Refresh Token: {refreshToken}</p>
          </div>
          <button
            id="obtain-new-token"
            className="btn btn-secondary"
            onClick={handleObtainNewToken}
          >
            Obtain new token
          </button>
          <div id="top-artists">
            <h2>Top 10 Artists</h2>
            <ul>
              {topArtists.map((artist) => (
                <li key={artist.id}>
                  <img src={artist.images[0].url} alt={artist.name} />
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
          <div id="top-tracks">
            <h2>Top 10 Tracks</h2>
            <ul>
              {topTracks.map((track) => (
                <li key={track.id}>
                  <img src={track.album.images[0].url} alt={track.name} />
                  {track.name} by {track.artists[0].name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
