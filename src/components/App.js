import '../App.css';
import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from '../contexts/SocketProvider';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home";
import Login from "./Login";
import GameSession from "./GameSession";


function App() {

  return (
        <Router>
          <SocketProvider>
            <AuthProvider>
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route path="/gamesSession" component={GameSession} />
                  <Container className="d-flex align-items-center justify-content-center minHeight">
                    <div className="w-100 maxWidth">
                      <Route path="/signup" component={Signup} />
                      <Route path="/login" component={Login} />
                    </div>
                  </Container>
                </Switch>
              </AuthProvider>
            </SocketProvider>
          </Router>

  )
}

export default App;
