import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Logo } from "../images/Netflix";
import {
  ConnectButton,
  Icon,
  Tab,
  TabList,
  Button,
  Modal,
  useNotification,
} from "web3uikit";
import { Movies } from "../helpers/library";
import { useMoralis } from "react-moralis";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const [myMovies, setMyMovies] = useState()
  const { isAuthenticated, Moralis, account } = useMoralis();
  async function fetchMyLists() {
    const mor = await Moralis.start({
      appId: "sfMduJX4SNh9qj6F9f7dUTuZHc3NCYVPq2Ceav36",
      serverUrl: "https://qasphpqsux46.usemoralis.com:2053/server",
    });
    if(account){
      const theList = await Moralis.Cloud.run("getMyList", {addrs: account});
      const filteredArray  = Movies.filter(movie => { if(theList.includes(movie.Name)){return movie} });
      console.log(myMovies);
      setMyMovies(filteredArray);
    }
  }
  useEffect(() => {
    fetchMyLists();
    console.log(myMovies);
  }, [account])
  
  const dispatch = useNotification();
  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please connect your wallet",
      title: "Not Authenticated",
      position: "topL",
    });
  };
  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie added to your list",
      title: "Success",
      position: "topL",
    });
  }
  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon fill="#ffffff" size={24} svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList defaultActiveKey={1} tabStyle="bar">
          <Tab tabKey={1} tabName={"Movies"}>
            <div className="scene">
              <img src={Movies[0].Scene} alt="scene" className="sceneImg" />
              <img className="sceneLogo" src={Movies[0].Logo} alt="logo" />
              <p className="sceneDesc">{Movies[0].Description}</p>
              <div className="playButton">
                <Link to="/player" state={Movies[0].Movie}>
                  <Button
                    icon="chevronRightX2"
                    text="Play"
                    theme="secondary"
                    type="button"
                  />
                </Link>
                <Button
                  icon="plus"
                  text="Add to My List"
                  theme="translucent"
                  type="button"
                  onClick={() => {
                    console.log(isAuthenticated);
                  }}
                />
              </div>
            </div>
            <div className="title">Movies</div>
            <div className="thumbs">
              {Movies &&
                Movies.map((movie, index) => {
                  return (
                    <img
                      src={movie.Thumnbnail}
                      className="thumbnail"
                      onClick={() => {
                        setVisible(true);
                        setSelectedFilm(movie);
                      }}
                    />
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={2} tabName={"TV Shows"} isDisabled={true}></Tab>
          <Tab tabKey={3} tabName={"My List"}>
            <div className="ownListContent">
                <div className="title">
                  Your Library
                </div>
                {
                  myMovies && isAuthenticated ? (
                    <>
                    <div className="ownThumbs">
                    {
                      myMovies.map((movie, index) => {
                        return (
                          <img
                            src={movie.Thumnbnail}
                            className="thumbnail"
                            onClick={() => {
                              setVisible(true);
                              setSelectedFilm(movie);
                            }}
                          />
                        );
                      }
                      )
                    }
                    </div>
                    </>
                  ) : (
                    <div className="ownThumbs">
                      You need to authorize your wallet to see your own list
                    </div>
                  )
                }
            </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
            <Modal
              isVisible={visible}
              onCloseButtonPressed={() => {
                setVisible(false);
              }}
              width="1000px"
              hasFooter={false}
            >
              <div className="modalContent">
                <img
                  src={selectedFilm.Scene}
                  alt="scene"
                  className="sceneImg"
                />
                <img className="sceneLogo" src={selectedFilm.Logo} alt="logo" />
                <p className="sceneDesc">{selectedFilm.Description}</p>
                <div className="playButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={
                          async () => {
                            await Moralis.Cloud.run("updateMyList", {
                              addrs: account,
                              newFav: selectedFilm.Name,
                            })
                            handleAddNotification();
                          }
                        }
                      />
                    </>
                  ) : (
                    <>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                          onClick={handleNewNotification}
                        />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )}
                </div>
                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className="detailedInfo">
                    Genre:
                    <span className="deets">{selectedFilm.Genre}</span>
                    <br />
                    Actors:
                    <span className="deets">{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
