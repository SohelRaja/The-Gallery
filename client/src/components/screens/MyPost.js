import React,{Component} from 'react';
import {Link} from 'react-router-dom';

export default class MyPost extends Component{
    render(){
    const postDataId = this.props.match.params.id;
    const posts = JSON.parse(localStorage.getItem('post'));
    const postData = posts.find(post=>{
        if(post._id === postDataId){
            return post;
        }
    })
    console.log(postData)
    return (
        <div className="home">
            <nav className="myBreadcrumb container #5e35b1 deep-purple darken-1">
                <div class="nav-wrapper container">
                <div class="col s12">
                    <Link to="/" class="breadcrumb">The Gallery</Link>
                    <Link to="/profile" class="breadcrumb">Profile</Link>
                    <Link class="breadcrumb">{postData.title.length > 10 ? postData.title.substring(0,10):postData.title.substring(0,postData.title.length)}{postData.title.length > 10?"...":""}</Link>
                </div>
                </div>
            </nav>
            <div className="card home-card" key={postData._id}>
                <div className="home-card-heading">
                    <div>
                        <h4 className="home-card-title">
                            {postData.title} {postData.privacy==="private"? <span className="btn-large btn-floating #5e35b1 deep-purple darken-1 my-post-lock"><i className="material-icons">lock</i></span>:""}
                        </h4>
                    </div>
                </div>
                <div className="card-image">
                    <img src={postData.photo} alt={postData.title} />
                </div>
                <div className="card-content">
                    <h6><b>{postData.likes.length} likes </b></h6>
                    <h5>{postData.body}</h5>
                    {
                        postData.comments.map(record=>{
                            return(
                                <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
    }
}