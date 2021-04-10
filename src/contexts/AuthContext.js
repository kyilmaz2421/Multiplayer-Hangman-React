import React, { useContext, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const AuthContext = React.createContext();
const AuthContextUpdate = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthUpdate() {
  return useContext(AuthContextUpdate);
}

export function AuthProvider({ children }) {
  const [currentUsername, setCurrentusername] = useState();
  const [currentUserID, setCurrentuserID] = useState();
  const USER = gql`
    query {
      isUserLoggedIn {
        username
        id
        error
      }
    }
  `;
  const { data } = useQuery(USER);

  function setState(username, id) {
    setCurrentusername(username);
    setCurrentuserID(id);
  }

  const value = {
    data,
    currentUsername,
    currentUserID,
    setState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
