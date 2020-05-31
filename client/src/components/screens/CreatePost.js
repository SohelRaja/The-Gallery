import React from 'react';

const CreatePost = () =>{
    return (
        <div className="card input-field post-card">
            <h2>Create Post</h2>
            <input type="text" placeholder="Title" />
            <input type="text" placeholder="Description" />
            <div className="file-field input-field">
                <div className="btn #5e35b1 deep-purple darken-1">
                    <span>Upload Image</span>
                    <input type="file" multiple />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <div className="privacy-button">
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" checked />
                    <span>Public</span>
                    </label>
                </p>
                <p>
                    <label>
                    <input className="with-gap left" name="group3" type="radio" />
                    <span>Private</span>
                    </label>
                </p>
            </div>
            <button class="btn waves-effect waves-light #5e35b1 deep-purple darken-1">
                Upload Post
            </button>
        </div>
    );
}

export default CreatePost;