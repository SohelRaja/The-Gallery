import React,{useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

import {UserContext} from './../../App';
import NotFoundPage from './NotFoundPage';

const Admin = () => {
    const [data, setData] = useState([]);
    const [postData, setPostData] = useState({});
    const {state, dispatch} = useContext(UserContext);
    useEffect(()=>{
        fetch('/allusers',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            result.allusers && setData(result.allusers);
            result.error && setData(result)
            if(result.error){
                return M.toast({html: result.error, classes: "#f44336 red"});
            }
            // console.log(result)
        }).catch(err=>{
            console.log(err);
        });
        fetch('/numberofposts',{
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
                M.toast({html: "User's priority changed", classes: "#ab47bc purple lighten-1"});
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    return (
        <div>
            { data.error ? <NotFoundPage /> :
            <div className="container">
                <div className="col s12 m6 l6">
                    <div className="card-panel #9575cd deep-purple lighten-2 z-depth-1">
                    <div className="row valign-wrapper">
                        <div className="col s12 center-align">
                            <h5 className="white-text">
                                Total No. of Users : <h3>{data.length}</h3>
                            </h5>
                            <hr />
                            <h5 className="white-text">
                                Total No. of Posts : <b>{postData.allPost}</b>
                            </h5>
                            <h6 className="black-text">
                                Total No. of Public Posts : <b>{postData.allPost - postData.private}</b>
                            </h6>
                            <h6 className="black-text">
                                Total No. of Private Posts : <b>{postData.private}</b>
                            </h6>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            }
            <div className="row">
            {
                !data.error && data.map(item=>{
                    return (
                        <div className="container">
                            <div className="col s12 m6 l6"  key={item._id}>
                                <div className="card-panel grey lighten-5 z-depth-1 admin-user-plate">
                                    <div className="row valign-wrapper">
                                        <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`} className="col s2">
                                            <img src={item.pic} alt="" style={{height: "60px", width: "60px"}}/> 
                                            <b className="admin-user-priority">{(item.priority === "admin" && "Admin")||(item.priority === "normal" && "User")||(item.priority === "owner" && "Owner")}</b>
                                        </Link>
                                        <div className="col offset-s2 s10">
                                            <p className="black-text admin-user-title">
                                                <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`}><b>{item.name}</b></Link>
                                            </p>
                                            <p className="black-text">
                                                {item.email}
                                            </p>
                                            {item.priority !== "owner" ?
                                                state.priority === "owner" && 
                                                <p>
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
                                                </p> :
                                                state.priority === "owner" &&
                                                <p>
                                                    <span className="owner-badge">You are the owner.</span>
                                                </p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) 
            }
            </div>
        </div>
    );
}

export default Admin;