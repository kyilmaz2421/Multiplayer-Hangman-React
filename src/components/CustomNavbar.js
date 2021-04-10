import React from 'react';
import { Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Logout from "./Logout";


export default function CustomNavbar() {
    const {currentUsername} = useAuth();
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>Welcome to Hangman {currentUsername}! </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
            </Navbar.Collapse>
            <div className="float-right">
             <Logout></Logout>  
            </div>
        </Navbar>
    )
}
