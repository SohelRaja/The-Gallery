import React from 'react';
import {Link} from 'react-router-dom';

const Signin = () => {
    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Sign In</h2>
                <input 
                    type='text'
                    placeholder='Email'
                />
                <input 
                    type='text'
                    placeholder='Password'
                />
                <button className="btn waves-effect waves-light #5e35b1 deep-purple darken-1">
                    Signin
                </button>
                <h6 className='sign-link'><Link to='/signup'>Don't have an account ?</Link></h6>
            </div>
        </div>
    );
}

export default Signin;