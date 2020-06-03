import React,{useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from './../../App';

const Home = () => {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        fetch('/allpost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setData(result.posts);
            // console.log(result)
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    const likePost = (id) => {
        fetch('/like',{
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
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        });
    }
    const unlikePost = (id) => {
        fetch('/unlike',{
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
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        });
    }

    const makeComment = (text, postId)=>{
        if(text && text.length){
            fetch("/comment",{
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    text: text,
                    postId: postId
                })
            }).then(res=>res.json())
            .then(result=>{
                // console.log(result);
                const newData = data.map(item=>{
                    if(item._id === result._id){
                        return result;
                    }else{
                        return item;
                    }
                })
                setData(newData);
                M.toast({html: "Comment added", classes: "#ab47bc purple lighten-1"});
            }).catch(err=>{
                console.log(err);
            });
        }else{
            M.toast({html: "Enter a valid comment", classes: "#f44336 red"});
        }
    }
    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData);
            M.toast({html: "Successfully deleted", classes: "#ab47bc purple lighten-1"});
        })
    }
    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <div className="home-card-heading">
                                <div>
                                <Link to={item.postedBy._id == state._id ? "/profile" : `/profile/${item.postedBy._id}`}><img src={item.postedBy.pic} alt="profile-pic"/></Link>
                                </div>
                                <div>
                                    <h5 className="home-card-title">
                                        <Link to={item.postedBy._id == state._id ? "/profile" : `/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>
                                        {item.postedBy._id == state._id &&
                                            <i className="material-icons delete-icon"
                                                onClick={()=>deletePost(item._id)}
                                            >delete</i>
                                        }
                                    </h5>
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} alt="pic" />
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id) 
                                    ? 
                                    <i className="material-icons love-icon"
                                        onClick={()=>{
                                            unlikePost(item._id)
                                        }}
                                    >favorite</i>
                                    : 
                                    <i className="material-icons love-icon-unlike"
                                        onClick={()=>{
                                            likePost(item._id)
                                        }}
                                    >favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        );
                                    })
                                }
                                <form
                                    onSubmit={(e)=>{
                                        e.preventDefault();
                                        makeComment(e.target[0].value.trim(), item._id);
                                        e.target[0].value = "";
                                    }}
                                >
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Home;