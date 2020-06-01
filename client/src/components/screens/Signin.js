import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signin = () => {
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    const PostData = () => {
        fetch("/signin",{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.error){
                M.toast({html: data.error, classes: "#f44336 red"});
            }else{
                M.toast({html: "Signed in successfully.", classes: "#ab47bc purple lighten-1"});
                history.push('/');
            }
        }).catch(err=>{
            console.log(err);
        });
    };
    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Sign In</h2>
                <input 
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type='text'
                    placeholder='Password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1"
                    onClick={()=>PostData()}
                >
                    Signin
                </button>
                <h6 className='sign-link'><Link to='/signup'>Don't have an account ?</Link></h6>
            </div>
        </div>
    );
}

export default Signin;