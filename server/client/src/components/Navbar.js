import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from '../App';

const NavBar = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
    const user = JSON.parse(localStorage.getItem('user'));

    const renderList = () => {
        if(state){
            return [
                <li><Link to="/subscriberspost">Subcribers Post</Link></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1 logout-button"
                        onClick={()=>{
                            localStorage.clear();
                            dispatch({type: "CLEAR"});
                            M.toast({html: "Successfully logged out.", classes: "#ab47bc purple lighten-1"});
                            history.push('/signin');
                        }}
                    >
                        Logout
                    </button>
                </li>
            ];
        }else{
            return [
                <li><Link to="/signin">Sign in</Link></li>,
                <li><Link to="/signup">Sign up</Link></li>
            ];
        }
    }
    return (
        <nav className="white mynavbar">
            <div className="nav-wrapper container">
            <Link to={state ? "/":"/signin"} className="brand-logo left">The Gallery</Link>
            {
                user ? 
                <Link className="sidenav-trigger right" data-target="mobile-menu">
                    <i className="material-icons">dehaze</i>
                </Link> : ""
            }
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            <ul className="sidenav my-btn-color" id="mobile-menu">
                <li>
                    <div className="user-view">
                        { user ?
                        <>
                            <div>
                                <img className="circle" src={user.pic} alt={user.name} />
                                <span className="sidenav-info name">{user.name}</span>
                                <span className="sidenav-info email">{user.email}</span><hr/>
                            </div>
                        </>
                        :
                        <>
                            <div>
                                <span className="sidenav-info name"><b>The Gallery</b></span>
                                <hr/>
                            </div>
                        </>
                        }
                    </div>
                </li>
                {renderList()}
            </ul>
            </div>
        </nav>
    );
}

export default NavBar;