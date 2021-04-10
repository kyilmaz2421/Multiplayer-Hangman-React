import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.REACT_APP_SERVER_URL + "graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
