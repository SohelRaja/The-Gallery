import React,{Component} from 'react';
import {Link, Redirect} from 'react-router-dom';

export default class MyPost extends Component{
    render(){
    const postDataId = this.props.match.params.id;
    const posts = JSON.parse(localStorage.getItem('post'));
    const postData = posts.find(post=>{
        if(post._id === postDataId){
            return post;
        }else {
            return <Redirect to='/profile' />;
        }
    })
    // console.log(postData)
    return (
        <div className="home">
            <nav className="myBreadcrumb container #5e35b1 deep-purple darken-1">
                <div className="nav-wrapper container">
                <div className="col s12">
                    <Link to="/" className="breadcrumb">The Gallery</Link>
                    <Link to="/profile" className="breadcrumb">Profile</Link>
                    <Link className="breadcrumb">{postData.title.length > 10 ? postData.title.substring(0,10):postData.title.substring(0,postData.title.length)}{postData.title.length > 10?"...":""}</Link>
                </div>
                </div>
            </nav>
            <div className="card home-card" key={postData._id}>
                <div style={{
                    padding: "2px",
                }}>
                    <div>
                        <h5 style={{margin: "5px", marginLeft: "10px", color: "#5e35b1"}} className="home-card-title truncate">
                            {postData.title} {postData.privacy==="private"? <span className="btn-large btn-floating #5e35b1 deep-purple darken-1 my-post-lock"><i className="material-icons">lock</i></span>:""}
                        </h5>
                    </div>
                </div>
                <div className="card-image">
                    <img src={postData.photo} alt={postData.title} />
                </div>
                <div className="card-content">
                    <span style={{ color: "#e535b1"}}><b>{postData.likes.length} likes </b></span><span style={{ color: "#5e35b1", fontWeight: "700"}}>&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;</span>
                    <span style={{ color: "#5e35b1"}}><b>{postData.comments.length} comments </b></span>
                    <h5 className="truncate" style={{ color: "#5e35b1", borderBottom: "1px solid #5e35b1", paddingBottom: "20px"}}>{postData.body}</h5>
                    <h5 style={{ color: "#5e35b1"}}>Comments</h5>
                    {
                        postData.comments.map(record=>{
                            return(
                                <p>
                                    <h6 key={record._id} style={{color: '#e535b1'}}><span style={{fontWeight:"500", color: "#5e35b1"}}>{record.postedBy.name}</span>: &nbsp;{record.text}</h6>
                                </p>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
    }
}