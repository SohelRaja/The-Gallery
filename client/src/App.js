import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import './App.css';
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/create">
          <CreatePost />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
