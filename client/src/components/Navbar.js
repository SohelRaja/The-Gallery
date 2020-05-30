import React from 'react';
import {Link} from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="white mynavbar">
            <div className="nav-wrapper container">
            <Link to="/" className="brand-logo left">The Gallery</Link>
            <ul id="nav-mobile" className="right">
                <li><Link to="/signin">Sign in</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
            </div>
        </nav>
    );
}

export default NavBar;