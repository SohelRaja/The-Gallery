import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {UserContext} from '../App';

const NavBar = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const renderList = () => {
        if(state){
            return [
                <li><Link to="/subscriberspost">Subcribers Post</Link></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                        onClick={()=>{
                            localStorage.clear();
                            dispatch({type: "CLEAR"});
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
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    );
}

export default NavBar;