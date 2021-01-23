import React, {useEffect, useState, useContext} from 'react';
import { useParams } from 'react-router-dom';
import ReactTooltip from "react-tooltip";

import {UserContext} from '../../App';
import LoadingPage from './LoadingPage';

const UserProfile = () => {
    const [userProfile,setProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {userId} = useParams()
    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setProfile(result);
        }).catch(err=>{
            console.log(err);
        });
    },[userId]);
    const followUser = ()=>{
        fetch('/follow',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload: {followers: data.followers, following: data.following}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload: {followers: data.followers, following: data.following}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                const newFollowers = prevState.user.followers.filter(item=>{
                    return(
                        item !== data._id
                    )
                })
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            })
        })
    }
    return (
    <>
    {userProfile && !userProfile.error ? 
        <div className="profile">
            <div className="user-profile-card profile-card-plate" style={{borderBottom:"2px solid #5e35b1"}}>
                <div className="profile-pic-plate">
                    <img className="profile-pic" src={userProfile.user.pic} alt="profile-pic" />
                </div>
                <div className="user-profile">
                    <h5 style={{color:"#5e35b1"}}>
                        {userProfile.user.name}
                        {
                            userProfile && (userProfile.user.priority === "owner" || userProfile.user.priority === "admin" || userProfile.user.priority === "special") &&
                            <i className="material-icons verified-acc-tag" data-tip="Verified Account" data-background-color="#5e35b1">verified_user</i> 
                        }
                        {
                            userProfile && (userProfile.user.priority === "owner" || userProfile.user.priority === "admin" || userProfile.user.priority === "special") &&
                            <ReactTooltip />
                        }
                    </h5>
                    <h6 style={{color:"#7e57c2"}}>{userProfile.user.email}</h6>
                    <div className="user-profile-sub-info">
                        <h6><b style={{color: "#6a1b9a"}}>{userProfile.posts.length}</b> posts&nbsp;&nbsp;&nbsp;</h6>
                        <h6><b style={{color: "#6a1b9a"}}>{userProfile.user.followers.length}</b> followers&nbsp;&nbsp;&nbsp;</h6>
                        <h6><b style={{color: "#6a1b9a"}}>{userProfile.user.following.length}</b> following</h6>
                    </div>
                    {
                        userProfile.user.followers.includes(state._id) ?
                        <button style={{margin: "10px"}} className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                            onClick={()=>unfollowUser()}
                        >
                            Following...
                        </button> :
                        <button style={{margin: "10px"}} className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                            onClick={()=>followUser()}
                        >
                            Follow
                        </button>
                    }
                </div>
            </div>
            <div className="row profile-gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <div className="col s12 m6 profile-gallery-item" key={item._id}>
                                <div className="card">
                                    <div className="card-image">
                                        <img className="gallery-pic" src={item.photo} alt={item.title} />
                                        <span className="card-title">
                                            {item.title.length > 10 ? item.title.substring(0,10):item.title.substring(0,item.title.length)}{item.title.length > 10?"...":""}
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <p style={{color:"#e91e63"}}><b>{item.likes.length} likes</b></p>
                                        <p>{item.body.length > 25 ? item.body.substring(0,25):item.body.substring(0,item.body.length)}{item.body.length > 25?"...":""}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    : <LoadingPage />
    }
    </>
    );
}

export default UserProfile;