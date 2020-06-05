import React, {useContext, useRef, useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from '../App';

const NavBar = () => {
    const searchModal = useRef(null);
    const [search, setSearch] = useState("");
    const {state, dispatch} = useContext(UserContext);
    const [userDetails, setUserDetails] = useState([]);
    const history = useHistory();
    let sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList = () => {
        if(state){
            return [
                <li key="1"><i data-target="search-modal" className="large material-icons modal-trigger" style={{color: "#5e35b1", cursor: "pointer"}}>search</i></li>,
                <li key="2"><Link to="/subscriberspost">Subcribers Post</Link></li>,
                <li key="3"><Link to="/profile">Profile</Link></li>,
                <li key="4"><Link to="/create">Create post</Link></li>,
                <li key="5">
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
                <li key="6"><Link to="/signin">Sign in</Link></li>,
                <li key="7"><Link to="/signup">Sign up</Link></li>
            ];
        }
    }
    const fetchUsers = (query) => {
        setSearch(query);
        fetch('/search-users',{
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                query: query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user);
        })
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
            <div id="search-modal" className="modal" ref={searchModal} style={{color: "#5e35b1"}}>
                <div className="modal-content">
                    <input 
                        type='text'
                        placeholder='Search Users'
                        value={search}
                        onChange={(e)=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {
                            userDetails.map(item=>{
                            return <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`}
                                onClick={()=>{
                                    M.Modal.getInstance(searchModal.current).close();
                                    setSearch('');
                                    setUserDetails([]);
                                }}
                            ><li key={item._id} className="collection-item">{item.email} -> <b>{item.name}</b></li></Link>
                            })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                    onClick={()=>{
                        setSearch('');
                        setUserDetails([]);
                    }}>Close</button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;