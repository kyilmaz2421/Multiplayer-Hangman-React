import React, { useEffect, useContext } from "react";
import { SocketContext } from "../../contexts/SocketProvider";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

const InvitationPopup = ({ showPopup, setShowPopup }) => {
  const socket = useContext(SocketContext);
  const history = useHistory();

  const handleYes = async () => {
    await socket.emit("join-game-lobby", showPopup.invitation);
    setShowPopup({
      invitation: showPopup.invitation,
      show: true,
      acceptedInvite: true,
    });
  };
  const handleNo = async () => {
    await socket.emit("trigger-lobby-removal", {
      hostName: showPopup.invitation.host,
      userToRemove: showPopup.invitation.newUser,
      senderSocketLeaveTo: true,
    });
    setShowPopup({
      show: false,
    });
  };

  useEffect(() => {
    socket.on("game-start", ({ invitation }) => {
      history.push("/gamesSession");
    });
  }, []);

  return (
    <div
      className="popup-container"
      style={showPopup.show ? { display: "flex" } : {}}
    >
      <div className="popup">
        <h4>You are invited to a game of Hangman with the following users:</h4>
        <h4>
          {showPopup.invitation
            ? [
                ...showPopup.invitation.members,
                showPopup.invitation.host,
              ].reduce((result, item) => `${result}, ${item}`)
            : "2"}
        </h4>
        <h4>would you like to join?</h4>
        <br />
        <h5>
          {showPopup.acceptedInvite
            ? "Please wait for host to start game..."
            : ""}
        </h5>
        <Button
          disabled={showPopup.acceptedInvite}
          className="spacedButtons"
          variant="light"
          onClick={handleYes}
        >
          Yes
        </Button>
        <Button className="spacedButtons" variant="light" onClick={handleNo}>
          {" "}
          {showPopup.acceptedInvite ? "Leave Lobby" : "No"}
        </Button>
      </div>
    </div>
  );
};

export default InvitationPopup;
