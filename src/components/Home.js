import React from "react";
import '../App.css';
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CustomNavbar from "./CustomNavbar"
import Lobby from "./Lobby";

export default function Home() {
    const {currentUsername,currentUserID, setState, data} = useAuth();
    const history = useHistory();
    
    if(!data){
      return null
    }

    if((currentUsername && currentUserID) || (data && !data.isUserLoggedIn.error)){

        if(!currentUsername || !currentUserID){
          setState(data.isUserLoggedIn.username, data.isUserLoggedIn.id);
        }

        return (
          <>
            <CustomNavbar></CustomNavbar> 
            <Lobby></Lobby> 
          </>
      )
    }else{
      history.push("/login");
      return null
    }
  
}
