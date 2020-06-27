import React,{useState, useEffect, useContext, useRef} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from './../../App';
import NotFoundPage from './NotFoundPage';

const Admin = () => {
    const deletePostModal = useRef(null);

    const [data, setData] = useState([]);
    const [postData, setPostData] = useState([]);

    const [flag, setUserFlag] = useState(true);
    const [feed, setFeedData] = useState([]);
    const [deletePostInfo,setDeletePostInfo] = useState([]);
    
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        M.Modal.init(deletePostModal.current);

        fetch('/allusers',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            result.allusers && setData(result.allusers);
            result.error && setData(result);
            if(result.error){
                return M.toast({html: result.error, classes: "#f44336 red"});
            }
            // console.log(result)
        }).catch(err=>{
            console.log(err);
        });

        // Fetching All Public Posts
        fetch('/allpost',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            setPostData(result.posts);
            // console.log(result)
        }).catch(err=>{
            console.log(err);
        });
        // fetch('/numberofposts',{
        //     headers: {
        //         "Authorization": "Bearer " + localStorage.getItem("jwt")
        //     }
        // }).then(res=>res.json())
        // .then((result)=>{
        //     setPostData(result.posts);
        //     // console.log(result)
        // }).catch(err=>{
        //     console.log(err);
        // });
    },[]);
    const changeToAdmin = (id) => {
        fetch('/changetoadmin',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            if(result.error){
                M.toast({html: result.error, classes: "#f44336 red"});
            }else{
                const updatedData = data.map(item=>{
                    if(item._id === result._id){
                        return result;
                    }else{
                        return item;
                    }
                })
                setData(updatedData);
                setFeedData(updatedData);
                M.toast({html: "User's priority changed", classes: "#ab47bc purple lighten-1"});
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    const changeToUser = (id) => {
        fetch('/changetouser',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userId: id
            })
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result);
            if(result.error){
                M.toast({html: result.error, classes: "#f44336 red"});
            }else{
                const updatedData = data.map(item=>{
                    if(item._id === result._id){
                        return result;
                    }else{
                        return item;
                    }
                })
                setData(updatedData);
                setFeedData(updatedData);
                M.toast({html: "User's priority changed", classes: "#ab47bc purple lighten-1"});
            }
        }).catch(err=>{
            console.log(err);
        });
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
            const newData = postData.filter(item=>{
                return item._id !== result._id
            })
            setPostData(newData);
            setFeedData(newData);
            result && !result.error 
                ? 
                M.toast({html: "Successfully deleted", classes: "#ab47bc purple lighten-1"})
                :    
                M.toast({html: result.error, classes: "#ff5252 red accent-2"})
            ;
        })
    }
    return (
        <div>
            { data.error ? <NotFoundPage /> :
            <div className="container">
                <div className="col s12 m6 l6">
                    <div className="card-panel #9575cd deep-purple lighten-2 z-depth-1">
                        <div className="row valign-wrapper">
                            <div className="col s12 center-align">
                                <div className="admin-all-user-plate">
                                    <h5 className="white-text">
                                        Total No. of Users : <h3 className="number">{data.length}</h3>
                                    </h5>
                                    <button className="btn waves-effect waves-light admin-button"
                                        onClick={()=>{
                                            setFeedData(data);
                                            setUserFlag(true);
                                        }}
                                    >
                                        Show All Users
                                    </button>
                                </div>
                                <div className="admin-post-plate">
                                    <h5 className="white-text">
                                        Total No. of Public Posts : <h3 className="number">{postData.length}</h3>
                                    </h5>
                                    <button className="btn waves-effect waves-light admin-button"
                                        onClick={()=>{
                                            setFeedData(postData);
                                            setUserFlag(false);
                                        }}
                                    >
                                        Show All Posts
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><br/>
            </div>
            }
            <div className="row">
            {data.error ? <NotFoundPage /> :
                feed && feed.map(item=>{
                    return (
                        <div className="container">
                            <div className="col s12 m6 l6"  key={item._id}>
                                {flag ?
                                <div className="card-panel grey lighten-5 z-depth-1 admin-user-plate">
                                    <div className="row valign-wrapper">
                                        <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`} className="col s2">
                                            <img src={item.pic} alt="" style={{height: "60px", width: "60px"}}/> 
                                            {(item.priority === "owner" || item.priority === "admin")&&<b className="admin-user-priority">{(item.priority === "admin" && "Admin")||(item.priority === "owner" && "Owner")}</b>}
                                        </Link>
                                        <div className="col offset-s1 s10">
                                            <p className="black-text admin-user-title">
                                                <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`}><b>{item.name}</b></Link>
                                            </p>
                                            <p className="black-text">
                                                {item.email.length < 25 ? item.email : item.email.substring(0,24)}{item.email.length > 24 ? "..." : ""}
                                            </p>
                                            {item.priority !== "owner" ?
                                                state.priority === "owner" && 
                                                <>
                                                {   
                                                    item.priority === "normal" &&
                                                    <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                                                        onClick={()=>changeToAdmin(item._id)}
                                                    >Make Admin</button>
                                                }
                                                {   
                                                    item.priority === "admin" &&
                                                    <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                                                        onClick={()=>changeToUser(item._id)}
                                                    >Make User</button>
                                                }
                                                </>
                                                :
                                                state.priority === "owner" &&
                                                <p className="owner-badge">The Owner</p>
                                            }
                                        </div>
                                    </div>
                                </div> 
                                :
                                <div className="card-panel grey lighten-5 z-depth-1 admin-user-plate">
                                    <div className="row valign-wrapper">
                                        <div className="col s4">
                                            <img src={item.photo} alt="" style={{height: "100px", width: "100px"}}/>
                                        </div>
                                        <div className="col offset-s1 s7">
                                            <p className="black-text admin-user-title truncate">
                                                <Link to={item.postedBy._id === state._id ? "/profile" : `/profile/${item.postedBy._id}`}><b>{item.postedBy.name}</b></Link>
                                            </p>
                                            <p className="black-text truncate">
                                                {item.title.length < 25 ? item.title : item.title.substring(0,24)}{item.title.length > 24 ? "..." : ""}
                                            </p>
                                            {item.postedBy.priority !== "owner" ? 
                                                <button 
                                                    className="btn waves-effect waves-light #ff5252 red accent-2 modal-trigger"
                                                    data-target="delete-post-modal"
                                                    onClick={()=>setDeletePostInfo(item)}
                                                >Delete Post</button>
                                                :
                                                <div className="owner-badge">Inaccessible</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    )
                }) 
            }
            </div>
            <div id="delete-post-modal" className="modal" ref={deletePostModal} style={{color: "#5e35b1"}}>
                <div className="modal-content">
                    <h4>Delete Post</h4>
                    <h6 className="truncate">Do you want to delete <b>{deletePostInfo.title}</b> ?</h6>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" 
                        onClick={()=>{
                            setDeletePostInfo([]);
                        }}
                    >Close</button>
                   <button className="waves-effect waves-green btn-flat" 
                    onClick={()=>{
                        deletePost(deletePostInfo._id);
                        setDeletePostInfo([]);
                        M.Modal.getInstance(deletePostModal.current).close();
                    }}
                   >Delete</button>
                </div>
            </div>
        </div>
    );
}

export default Admin;