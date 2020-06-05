import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

import {UPLOAD_PRESET, CLOUD_NAME, BASE_URL} from '../../keys';

const Signup = () => {
    const history = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [url,setUrl] = useState(undefined);
    const [image,setImage] = useState("");

    useEffect(()=>{
        if(url){
            UploadRest();
        }
    },[url]);
    const UploadPic = () => {
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
    const UploadRest = () => {
        fetch("/signup",{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                pic: url
            })
        }).then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
            }else{
                M.toast({html: data.message, classes: "#ab47bc purple lighten-1"});
                history.push('/signin');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    const PostData = () => {
        if(image){
            UploadPic();
        }else{
            UploadRest();
        }
    };
    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Sign Up</h2>
                <input 
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input 
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #5e35b1 deep-purple darken-1">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button 
                    className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                    onClick={()=>PostData()}
                >
                    Signup
                </button>
                <h6 className='sign-link'><Link to='/signin'>Already have an account ?</Link></h6>
                <h6 style={{color: "#5e35b1"}}> Dev ❤️ ed by <a href="https://sohelraja.github.io" style={{color: "#e91e63"}}>Sohel Raja Molla</a></h6>
            </div>
        </div>
    );
}

export default Signup;