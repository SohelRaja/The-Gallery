const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {JWT_SECRET} = require('../keys');
const User = mongoose.model('User');

module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        // 401 -> unauthorized
        return res.status(401).json({
            error: "You must be logged in."
        });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if(err){
            return res.status(401).json({
                error: "You must be logged in."
            });
        }
        const {_id} = payload;
        User.findById(_id)
        .then((userData)=>{
            userData = {
                _id: userData._id,
                email: userData.email,
                name: userData.name,
                followers: userData.followers,
                following: userData.following,
                pic: userData.pic
            }
            req.user = userData;
            next();
        });
    });
}