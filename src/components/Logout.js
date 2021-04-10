import React, { useState, useContext } from "react";
import { Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { SocketContext} from '../contexts/SocketProvider';

export default function Logout() {
    const {currentUsername, currentUserID, setState } = useAuth();
    const [errorHandler, setErrorHandler] = useState("");
    const history = useHistory();
    const socket = useContext(SocketContext)


    const LOGOUT = gql `
    mutation logout($_id: ID!){
        logout(_id: $_id) {
          username
          id
          error
        }
    }`;
    const [logout, {data}] = useMutation(LOGOUT);
    async function handleLogout() {
        setErrorHandler("");
        try {
            const {data} = await logout({ variables: { _id: currentUserID}});
            if(data.logout.error){
                setErrorHandler(data.logout.error);
            }else{
                setState(null, null);
                //await socket.emit("logout", {username: currentUsername})
            }
        } catch {
                setErrorHandler("Failed to log out");
        }
        history.push("/login");
    }

    return (  
        <Button variant="outline-primary" onClick={handleLogout}>
            Log Out
        </Button>
    )
}