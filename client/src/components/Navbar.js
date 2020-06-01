import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import {UserContext} from '../App';

const NavBar = () => {
    const {state, dispatch} = useContext(UserContext);
    const renderList = () => {
        console.log(state)
        if(state){
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create post</Link></li>
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
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    );
}

export default NavBar;