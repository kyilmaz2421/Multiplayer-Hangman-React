import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Popup = ({ gameStatus, selectedWord, setPlayable }) => {
  const history = useHistory();
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let playable = true;

  if (gameStatus !== "") {
    if (gameStatus === "win") {
      finalMessage = "Congratulations! You guys worked together and won! 😃";
      playable = false;
    } else if (gameStatus === "lose") {
      finalMessage = "Unfortunately you lost. 😕";
      finalMessageRevealWord = `...the word was: ${selectedWord}`;
      playable = false;
    }
  }

  useEffect(() => {
    //timeout to close the popup
    if (!playable) {
      const timeout = setTimeout(() => {
        history.push("/");
      }, 4000);
    }
  }, [playable]);

  useEffect(() => {
    setPlayable(playable);
  });

  return (
    <div
      className="popup-container"
      style={finalMessage !== "" ? { display: "flex" } : {}}
    >
      <div className="popup">
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>
        <br />
        <h5>{"Exiting game ..."}</h5>
      </div>
    </div>
  );
};

export default Popup;
