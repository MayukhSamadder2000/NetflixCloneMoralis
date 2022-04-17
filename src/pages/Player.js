import React from "react";
import { Link, useLocation } from "react-router-dom";
import './Player.css'
import { Icon } from "web3uikit";

const Player = () => {
  const { state : currentlyPlaying} = useLocation();
  return (
    <>
    <div className="playerPage">
      <video autoPlay controls className="videoPlayer">
        <source src={currentlyPlaying} type="video/mp4"  />
      </video>
      <div className="backHome">
        <Link to="/">
          <Icon
            fill="rgba(255, 255, 255, 0.25)"
            size={60}
            svg="arrowCircleLeft"
            ></Icon>
        </Link>
      </div>
      </div>
    </>
  );
};

export default Player;
