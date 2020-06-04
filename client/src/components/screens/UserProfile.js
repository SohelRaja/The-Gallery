import React, {useEffect, useState, useContext} from 'react';
import { useParams } from 'react-router-dom';

import {UserContext} from '../../App';

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
    {userProfile ? 
        <div className="profile">
            <div className="profile-card profile-card-plate" style={{borderBottom:"2px solid #5e35b1"}}>
                <div>
                    <img className="profile-pic" src={userProfile.user.pic} alt="profile-pic" />
                </div>
                <div className="profile-info">
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div className="profile-sub-info">
                        <h6><b style={{color: "#6a1b9a"}}>{userProfile.posts.length}</b> posts</h6>
                        <h6><b style={{color: "#6a1b9a"}}>{userProfile.user.followers.length}</b> followers</h6>
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
                                        <img src={item.photo} alt={item.title} />
                                        <span className="card-title">
                                            {item.title.length > 20 ? item.title.substring(0,20):item.title.substring(0,item.title.length)}{item.title.length > 20?"...":""}
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <p><b>{item.likes.length} likes</b></p>
                                        <p>{item.body.length > 30 ? item.body.substring(0,30):item.body.substring(0,item.body.length)}{item.body.length > 30?"...":""}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    : <h2>loading...</h2>
    }
    </>
    );
}

export default UserProfile;