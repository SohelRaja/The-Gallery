import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UPLOAD_PRESET, CLOUD_NAME, BASE_URL} from '../../keys';

const CreatePost = () =>{
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [url, setUrl] = useState("");

    // It will kick start when url will be present.
    useEffect(()=>{
        if(url){
            // Request to Backend Server
            fetch("/createpost",{
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url,
                    privacy
                })
            }).then(res=>res.json())
            .then((data)=>{
                console.log(data);
                if(data.error){
                    M.toast({html: data.error, classes: "#f44336 red"});
                }else{
                    M.toast({html: "Created post successfully.", classes: "#ab47bc purple lighten-1"});
                    history.push('/');
                }
            }).catch(err=>{
                console.log(err);
            });
        }
    },[url,title,body,image,privacy,history]);

    const postDetails = () =>{
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
        })
        .catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="card input-field post-card">
            <h2>Create Post</h2>
            <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Description"
                value={body}
                onChange={(e)=>setBody(e.target.value)} 
            />
            <div className="file-field input-field">
                <div className="btn #5e35b1 deep-purple darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <div className="privacy-button">
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" 
                    value="public"
                    onChange={(e)=>setPrivacy(e.target.value)}
                    checked
                    />
                    <span>Public</span>
                    </label>
                </p>
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" 
                    value="private"
                    onChange={(e)=>setPrivacy(e.target.value)}/>
                    <span>Private</span>
                    </label>
                </p>
            </div>
            <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                onClick={()=>postDetails()}
            >
                Upload Post
            </button>
        </div>
    );
}

export default CreatePost;