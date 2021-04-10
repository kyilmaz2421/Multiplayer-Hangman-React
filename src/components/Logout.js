import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

export default function Logout() {
  const { currentUserID, setState } = useAuth();
  const [errorHandler, setErrorHandler] = useState("");
  const history = useHistory();

  const LOGOUT = gql`
    mutation logout($_id: ID!) {
      logout(_id: $_id) {
        username
        id
        error
      }
    }
  `;
  const [logout, { data }] = useMutation(LOGOUT);
  async function handleLogout() {
    setErrorHandler("");
    try {
      const { data } = await logout({ variables: { _id: currentUserID } });
      if (data.logout.error) {
        setErrorHandler(data.logout.error);
      } else {
        setState(null, null);
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
  );
}
