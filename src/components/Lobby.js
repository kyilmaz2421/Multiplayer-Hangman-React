import React, { useState, useEffect, useContext } from "react";
import '../App.css';
import { Container, Form, Card, Row, Col, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import InvitationPopup from "./InvitationPopup";
import { SocketContext} from '../contexts/SocketProvider';
import { useHistory, useParams } from "react-router-dom";
import { selectWord } from '../helpers/hangmanHelper';


export default function Lobby() {
    const {currentUsername} = useAuth();
    const history = useHistory();
    const socket = useContext(SocketContext);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [usersInLobby, setUsersInLobby] = useState([]);
    const [inviteName, setInviteName] = useState();
    const [showPopup, setShowPopup] =  useState({
      show: false,
    });

    socket.emit("join", {username: currentUsername});


    // SEND AND RECIEVE INVITES

    async function inviteNewUser() {
        setInvitedUsers(invitedUsers => [...invitedUsers, inviteName]);
        console.log("sending invite", {
            host: currentUsername,
            members: usersInLobby,
            newUser: inviteName
        });
        await socket.emit('send-invitation', { 
            invitation: {
                host: currentUsername,
                members: usersInLobby,
                newUser: inviteName
            }
      });
      setInviteName("")
    };


    useEffect(()=>{
        socket.on('receive-invite', ({invitation})=>{
            if(!showPopup.acceptedInvite){ // or in game -- need to set that up
                console.log("game invite:", invitation)
                setShowPopup({
                  show: true,
                  invitation
                })
            }
        });
    },[]);
    

    useEffect(()=>{
        socket.on('add-to-hosts-lobby', (lobby)=>{            
            if (invitedUsers.includes(lobby.newUser)){
                setInvitedUsers(invitedUsers => invitedUsers.filter((username)=>{
                    return lobby.newUser != username
                }));
            }else{
                setUsersInLobby(usersInLobby => [...usersInLobby, lobby.newUser]);
                setInvitedUsers(invitedUsers => invitedUsers.filter((username)=>{
                    return lobby.newUser != username
                }));
            }
        });
    },[]);


    // REMOVE FROM LOBBY

    useEffect(()=>{
        socket.on('remove-from-lobby', ({userToRemove})=>{
            console.log("YO",userToRemove,invitedUsers,invitedUsers.includes(userToRemove))
            if (invitedUsers.includes(userToRemove)){
                setInvitedUsers(invitedUsers => invitedUsers.filter((username)=>{
                    return userToRemove != username
                }));
            }else{
                setUsersInLobby(usersInLobby => usersInLobby.filter((username)=>{
                    return username != userToRemove
                }));
            }
        });
    },[]);

    // LAUNCH GAME FROM LOBBY

    async function launchGame(e) {
        e.preventDefault();
        const gameData = {
            host: currentUsername, 
            members: usersInLobby,
            word: selectWord()
        };
        console.log(gameData)
        await socket.emit('launch-game', gameData)
    }

    function launchGameScreen(gameData){
        history.push("/gamesSession/?gameID="+gameData._id+"&users="+gameData.members.join(",")+"&host="+gameData.host+"&currentUser="+currentUsername);
    }

    useEffect(()=>{
        socket.on('launch-game', (gameData)=>{
           launchGameScreen(gameData);
        });
    },[]);


    const removeUserFromLobby = (i, lobby) =>{
        if(lobby){
            socket.emit('trigger-lobby-removal', {
                hostName: currentUsername, 
                userToRemove: usersInLobby[i], 
                senderSocketLeaveTo:false
            });
            setUsersInLobby(usersInLobby => usersInLobby.filter((username)=>{
                return usersInLobby[i] != username
            }));
        }else{
            setInvitedUsers(invitedUsers => invitedUsers.filter((username)=>{
                return invitedUsers[i] != username
            }));
        }
    }

    return (
        <>
           <Container>
            <Row>
                <Col>
                    <h2 className="marginTop">Start a Hangman Game</h2>
                    <InputGroup className="mb-3" onChange={event => setInviteName(event.target.value)}>
                        <FormControl
                            value={inviteName}
                            placeholder="player username"
                            aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                            <Button variant="outline-dark" onClick={async () => await inviteNewUser()}>Invite User to Lobby</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <div className="marginTop">
                    <h3>Invited to Lobby</h3>
                    <Card>
                        <Card.Body>
                        {invitedUsers.map((user, i) => 
                        <Button key={i} onClick={() => removeUserFromLobby(i, false)} variant="outline-danger" className="spacedButtons">{user}</Button>)
                        }
                        </Card.Body>
                    </Card>
                    </div>
                    <div className="marginTop">
                        <h3>In Lobby (accepted invite)</h3>
                        <Card>
                            <Card.Body>
                            {usersInLobby.map((user, i) => 
                            <Button key={i} onClick={() => removeUserFromLobby(i, true)} variant="outline-success" className="spacedButtons">{user}</Button>)
                            }
                            </Card.Body>
                        </Card>
                    </div>
                    <Form onSubmit={launchGame}>
                        <Button disabled={usersInLobby.length == 0} variant="primary" type="submit" className="marginTop">Start Game</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        <InvitationPopup showPopup={showPopup} setShowPopup={setShowPopup} />  
      </>
    )
}
