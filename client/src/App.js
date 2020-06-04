import React, {useEffect, createContext, useReducer, useContext} from 'react';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';

import './App.css';
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import UserProfile from './components/screens/UserProfile';
import CreatePost from './components/screens/CreatePost';
import EditPost from './components/screens/EditPost';
import MyPost from './components/screens/MyPost';
import SubscribeUsersPost from './components/screens/SubscribeUsersPosts';
import {reducer, initialState} from './reducers/userReducer';

export const UserContext = createContext();

const Routing = ()=>{
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER", payload: user});
    }else{
      history.push('/signin');
    }
  },[history]);
  return(
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/editpost/:postId">
        <EditPost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/subscriberspost">
        <SubscribeUsersPost />
      </Route>
      <Route exact
      path="/mypost/:id"
      component={MyPost}
      >
      </Route>
    </Switch>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state:state, dispatch:dispatch}}>
        <BrowserRouter>
          <NavBar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
