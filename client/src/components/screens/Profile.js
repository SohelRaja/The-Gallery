import React, {useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from '../../App';
import {UPLOAD_PRESET,CLOUD_NAME,BASE_URL} from '../../keys';

const Profile = () => {
    const [myposts,setPosts] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [url,setUrl] = useState(undefined);
    const [image,setImage] = useState("");
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
    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset",UPLOAD_PRESET);
            data.append("cloud_name", CLOUD_NAME);
            // Request To Cloudinary
            fetch(BASE_URL, {
                method: "post",
                body: data
            })
            .then(res=>res.json())
            .then(data => {
                setUrl(data.url);
                console.log(data.url)
                localStorage.setItem("user", JSON.stringify({...state, pic: data.url}));
                dispatch({type:"UPDATEPIC", payload:{pic: data.url}})
            })
            .catch(err=>{
                console.log(err);
            });
        }
    },[image]);
    const updatePhoto = (file) => {
        setImage(file)
    }
    const makePublic = (id) => {
        fetch('/makepublic',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            const updatedMyPosts = myposts.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setPosts(updatedMyPosts);
            M.toast({html: "Updated to public mode", classes: "#ab47bc purple lighten-1"});
        }).catch(err=>{
            console.log(err);
        });
    }
    const makePrivate = (id) => {
        fetch('/makeprivate',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            const updatedMyPosts = myposts.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setPosts(updatedMyPosts);
            M.toast({html: "Updated to private mode", classes: "#ab47bc purple lighten-1"});
        }).catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="profile">
            <div className="profile-card">
                <div className="profile-card-plate">
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
                <div className="file-field input-field" style={{margin: "10px"}}>
                    <div className="btn #5e35b1 deep-purple darken-1">
                        <span>Update Pic</span>
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
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
                                        {item.privacy==="private"? 
                                        <span className="btn-floating profile-lock waves-effect waves-light #ffffff white"
                                            onClick={()=>makePublic(item._id)}
                                        ><i className="material-icons">lock</i></span>
                                        :<span className="btn-floating profile-lock waves-effect waves-light #ffffff white"
                                            onClick={()=>makePrivate(item._id)}
                                        ><i className="material-icons">lock_open</i></span>}
                                        <Link to="/" className="btn-floating halfway-fab waves-effect waves-light #5e35b1 deep-purple darken-1"><i className="material-icons">edit</i></Link>
                                    </div>
                                    <div className="card-content">
                                        <span style={{color:"#5e35b1"}}><b>{item.privacy==="private"? "Private Mode" : "Public Mode"}</b></span>
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