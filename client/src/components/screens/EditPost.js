import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import M from 'materialize-css';



const EditPost = () =>{
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [fetchedPostId, setPostID] = useState("");
    const {postId} = useParams()
    useEffect(()=>{
        fetch(`/editpost/${postId}`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result)
            setTitle(result.title);
            setBody(result.body);
            setPostID(result._id);
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    const updatePost = () =>{
        // Request to Backend Server
        fetch("/updatepost",{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                postId
            })
        }).then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
                if(data.error === "Something went wrong."){
                    history.push('/profile');
                }
            }else{
                M.toast({html: "Updated post successfully.", classes: "#ab47bc purple lighten-1"});
                history.push('/profile');
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    return (
        <div className="card input-field post-card">
            <h2>Edit Post</h2>
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
            <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                onClick={()=>updatePost()}
            >
                Update Post
            </button>
        </div>
    );
}

export default EditPost;