import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

export default function Signup() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { setState } = useAuth();
  const [errorHandler, setErrorHandler] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const SIGNUP = gql`
    mutation signUp($username: String!, $password: String!) {
      signUp(username: $username, password: $password) {
        username
        id
        error
      }
    }
  `;
  const [signup, { data }] = useMutation(SIGNUP);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setErrorHandler("Passwords do not match");
    }

    try {
      setErrorHandler("");
      setLoading(true);

      const { data } = await signup({
        variables: {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        },
      });
      if (data.signUp.error) {
        setErrorHandler(data.signUp.error);
      } else {
        setState(data.signUp.username, data.signUp.id);
        history.push("/");
      }
    } catch {
      setErrorHandler("Failed to create an account");
    }

    setLoading(false);
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {errorHandler && <Alert variant="danger">{errorHandler}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" ref={usernameRef} required />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login"> Login </Link>
      </div>
    </>
  );
}
