import React,{Component} from 'react';

export default class MyPost extends Component{
    render(){
    const dataId = this.props.match.params.id;
    const posts = JSON.parse(localStorage.getItem('post'));
    const data = posts.find(post=>{
        if(post._id === dataId){
            return post;
        }
    })
    return (
        <div className="home">
            <div className="card home-card" key={data._id}>
                <div className="home-card-heading">
                    <div>
                        <h4 className="home-card-title">
                            {data.title} {data.privacy==="private"? <span className="btn-large btn-floating #5e35b1 deep-purple darken-1 my-post-lock"><i className="material-icons">lock</i></span>:""}
                        </h4>
                    </div>
                </div>
                <div className="card-image">
                    <img src={data.photo} alt={data.title} />
                </div>
                <div className="card-content">
                    <h5>{data.body}</h5>
                    {/* <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1">
                    Edit
                    </button> */}
                </div>
            </div>
        </div>
    );
    }
}