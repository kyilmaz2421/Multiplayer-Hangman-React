import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";
import '../App.css';
import { useAuth } from "../contexts/AuthContext";
import { SocketContext} from '../contexts/SocketProvider';
import HangmanPanel from './HangmanPanel';
import Header from "./hangman/Header";
import Figure from "./hangman/Figure";
import WrongLetters from "./hangman/WrongLetters";
import Word from "./hangman/Word";
import Popup from "./hangman/Popup";
import Notification from "./hangman/Notification";
import { showNotification as show, checkWin } from '../helpers/hangmanHelper';



export default function GameSession() {

    const {data} = useAuth();
    const socket = useContext(SocketContext);
    const gameID = window.location.href.split("=")[1].split("&")[0];
    const players= window.location.href.split("=")[2].split("&")[0].split(",");
    const host = window.location.href.split("=")[3].split("&")[0];
    const user = data.isUserLoggedIn.username || window.location.href.split("=")[4].split("&")[0];
    
    const [selectedWord, setSelectedWord] = useState("");
    const [playerMoves, setPlayerMoves] = useState([]);
    const [playerNames, setPlayerNames] = useState([]);
    const [playable, setPlayable] = useState(true);
    const [gameStatus, setGameStatus] = useState("");

    const [correctLetters, setCorrectLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    
    useEffect(() => {
        const handleKeydown = async event => {
          const { key, keyCode } = event;
          if (playable && keyCode >= 65 && keyCode <= 90) {
            const letter = key.toLowerCase();
            await socket.emit("register-move-log",{
                host,
                playerMoves: [...playerMoves, letter],
                playerNames: [...playerNames, user]
            });
            console.log([...playerMoves, letter])
            if (selectedWord.includes(letter)) {
              if (!correctLetters.includes(letter)) {
                // setCorrectLetters(currentLetters => [...currentLetters, letter]);
                await socket.emit("register-move",{
                  host,
                  gameID,
                  correctLetters: [...correctLetters, letter],
                  wrongLetters
                });
              } else {
                show(setShowNotification); //letter repeat notification
              }
            } else {
              if (!wrongLetters.includes(letter)) {
                // setWrongLetters(currentLetters => [...currentLetters, letter]);
                await socket.emit("register-move",{
                  host,
                  gameID,
                  correctLetters,
                  wrongLetters: [...wrongLetters, letter]
                });
              } else {
                show(setShowNotification); //letter repeat notifications
              }
            }
          }
        }
        window.addEventListener('keydown', handleKeydown);
    
        return () => window.removeEventListener('keydown', handleKeydown);
      }, [correctLetters, wrongLetters, playable]);

    useEffect(()=>{
        socket.on('game-update', (game)=>{
            if (selectedWord == ""){
              setSelectedWord(game.word);
            }
            if (game.win){
              setGameStatus("win");
            } else if(game.isComplete && !game.win){
              setGameStatus("lose");
            }
            setWrongLetters(game.wrongLetters);
            setCorrectLetters(game.correctLetters);
        });
    },[]);

    useEffect(()=>{
      socket.on('game-update-logs', ({playerMoves, playerNames})=>{
          setPlayerMoves(playerMoves);
          setPlayerNames(playerNames);
        });
    },[]);
    
    
    return (
      <>
        <div className="hangmanScroll">
            <Header/>
            <div className="game-container">
                <Figure wrongLetters={wrongLetters} />
                <WrongLetters wrongLetters={wrongLetters} />
                <Word selectedWord={selectedWord} correctLetters={correctLetters} />
            </div>
            <Popup gameStatus={gameStatus} user={user} selectedWord={selectedWord} setPlayable={setPlayable}/>
            <Notification showNotification={showNotification} />
            <HangmanPanel playerNames={playerNames} playerMoves={playerMoves} players={players}/>
        </div>
      </>
    )
}
