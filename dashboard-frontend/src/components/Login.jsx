import React, { useEffect } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({
  onLoginSuccess,
  onObtainNewToken,
  isLoggedIn,
  accessToken,
  refreshToken,
}) => {
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
      alert("There was an error during the authentication");
    } else {
      if (access_token) {
        $.ajax({
          url: "https://api.spotify.com/v1/me",
          headers: {
            Authorization: "Bearer " + access_token,
          },
          success: function (response) {
            onLoginSuccess(access_token, refresh_token, response);
          },
          error: function () {},
        });
      }
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    const client_id = "4ffbe15a463d48fe8b04415783748083";
    const redirect_uri = "http://localhost:5174/callback";
    const scopes = "user-read-private user-read-email";

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
        error: function () {
          alert("Failed to refresh token.");
        },
      });
    }
  };

  return (
    <div className="login-component">
      {!isLoggedIn ? (
        <div id="login">
          <button onClick={handleLogin} className="btn btn-primary">
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
        </div>
      )}
    </div>
  );
};

export default Login;
