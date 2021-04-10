import React, {useRef, useState, useContext} from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { SocketContext} from '../contexts/SocketProvider';


export default function Login() {

    const usernameRef = useRef();
    const passwordRef = useRef();
    const {setState} = useAuth();
    const [errorHandler, setErrorHandler] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const socket = useContext(SocketContext);

    const LOGIN = gql `
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password) {
        username
        id
        error
        }
    }`;
    const [login, {data}] = useMutation(LOGIN);
    
    async function handleSubmit(e) {
        e.preventDefault();
    
        try {
            setErrorHandler("");
            setLoading(true);
            const {data} = await login({ variables: { username: usernameRef.current.value, password: passwordRef.current.value }});
            if(data.login.error){
                setErrorHandler(data.login.error);
            }else{
                //await socket.emit("join", {username: data.login.username});
                setState(data.login.username, data.login.id);
                history.push("/")
            }

        } catch {
            setErrorHandler("Failed to login");
        }
    
        setLoading(false);
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    {errorHandler && <Alert variant="danger">{errorHandler}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" ref={usernameRef} required/>
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit"> 
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account?  <Link to="/signup"> Sign Up </Link>
            </div>
        </>
    )
}
