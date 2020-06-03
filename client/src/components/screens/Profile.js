import React, {useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import {UserContext} from '../../App';

const Profile = () => {
    const [myposts,setPosts] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        fetch('/mypost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setPosts(result.myposts);
            localStorage.setItem("post", JSON.stringify(result.myposts));
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    return (
        <div className="profile">
            <div className="profile-card">
                <div>
                    <img className="profile-pic" src={state? state.pic: "loading.."} alt="profile-pic"/>
                </div>
                <div className="profile-info">
                    <h4>{state? state.name : "loading..."}</h4>
                    <h5>{state? state.email : "loading..."}</h5>
                    <div className="profile-sub-info">
                        <h6>{myposts.length} posts</h6>
                        <h6>{state? state.followers.length : "0"} followers</h6>
                        <h6>{state? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="row profile-gallery">
                {
                    myposts ?
                    myposts.map(item=>{
                        return(
                            <div className="col s12 m6 profile-gallery-item" key={item._id}>
                                <div className="card">
                                    <div className="card-image">
                                        <Link to={`/mypost/${item._id}`}><img src={item.photo} alt={item.title} /></Link>
                                        <Link to={`/mypost/${item._id}`}>
                                            <span className="card-title">
                                                {item.title.length > 20 ? item.title.substring(0,20):item.title.substring(0,item.title.length)}{item.title.length > 20?"...":""}
                                            </span>
                                        </Link>
                                        <Link to={`/mypost/${item._id}`}>{item.privacy==="private"? <span className="btn-floating profile-lock waves-effect waves-light #ffffff white"><i className="material-icons">lock</i></span>:""}</Link>
                                        <Link to="/" className="btn-floating halfway-fab waves-effect waves-light #5e35b1 deep-purple darken-1"><i className="material-icons">edit</i></Link>
                                    </div>
                                    <div className="card-content">
                                        <p>{item.body.length > 30 ? item.body.substring(0,30):item.body.substring(0,item.body.length)}{item.body.length > 30?"...":""}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : "loading..."
                }
            </div>
        </div>
    );
}

export default Profile;