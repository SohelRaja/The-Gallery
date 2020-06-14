import React,{useState, useEffect, useContext, useRef} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from './../../App';

const Home = () => {
    const commentsModal = useRef(null);

    const [data, setData] = useState([]);
    const [comments, setComments] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        M.Modal.init(commentsModal.current);
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
            // console.log(result)
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
                                <Link to={item.postedBy._id === state._id ? "/profile" : `/profile/${item.postedBy._id}`}><img src={item.postedBy.pic} alt="profile-pic"/></Link>
                                </div>
                                <div>
                                    <h5 className="home-card-title">
                                        <Link to={item.postedBy._id === state._id ? "/profile" : `/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>
                                        {item.postedBy._id === state._id &&
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
                                    <span className="love-icon-plate">
                                        <i className="material-icons love-icon"
                                        onClick={()=>{
                                            unlikePost(item._id)
                                        }}
                                        >favorite</i>
                                        &nbsp;liked
                                    </span>
                                    : 
                                    <span className="love-icon-plate">
                                        <i className="material-icons love-icon-unlike"
                                        onClick={()=>{
                                            likePost(item._id)
                                        }}
                                        >favorite_border</i>
                                    </span>
                                    
                                }
                                <span className="comment-icon-plate">
                                    <i className="material-icons comment-icon modal-trigger"
                                        data-target="comments-modal"  
                                        onClick={()=>{
                                            setComments(item.comments)
                                        }}
                                    >comment</i>
                                </span>
                                <h6 style={{color: "#5e35b1"}}><b>{item.likes.length} likes</b></h6>
                                <h6 className="truncate" style={{color: "#5e35b1"}}><b>{item.title}</b></h6>
                                <p className="truncate">{item.body}</p><br/>
                                <span className="modal-trigger" data-target="comments-modal"
                                    style={{
                                        color: "#5e35b1",
                                        cursor: "pointer",
                                        fontWeight: "500"
                                    }}
                                    onClick={()=>{
                                        setComments(item.comments)
                                    }}
                                    >{item.comments.length > 1 ? <p>view all {item.comments.length} comments</p>: ""}</span>
                                    <span className="modal-trigger" data-target="comments-modal"
                                        style={{
                                            color: "#5e35b1",
                                            cursor: "pointer",
                                            fontWeight: "500"
                                        }}
                                        onClick={()=>{
                                            setComments(item.comments)
                                        }}
                                    >{item.comments.length === 1 ? <p>view {item.comments.length} comment</p>: ""}</span>
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
            <div id="comments-modal" className="modal bottom-sheet" ref={commentsModal} style={{color: "#5e35b1"}}>
                <div className="modal-content container">
                    <h5 style={{borderBottom: "2px solid #5e35b1", paddingBottom: "15px"}}>Comments</h5>
                    {
                        comments.map(record=>{
                            return(
                                <h6 key={record._id} style={{color: "#d500f9"}}>
                                    <Link to={record.postedBy._id === state._id ? "/profile" : `/profile/${record.postedBy._id}`}>
                                        <span style={{fontWeight:"500", color: "#5e35b1"}}>{record.postedBy.name} : </span>
                                    </Link>
                                    &nbsp;&nbsp;{record.text}
                                </h6>
                            );
                        })
                    }
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                        onClick={()=>{
                            setComments([]);
                        }}
                    >Close</button>
                </div>
            </div>
        </div>
    );
}

export default Home;