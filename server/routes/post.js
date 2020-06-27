const express = require('express');
const mongoose = require('mongoose');

// Cloudinary setup
const cloudinary = require('cloudinary').v2;

const {CLOUD_NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY} = require('./../config/keys');

cloudinary.config({
    cloud_name: CLOUD_NAME_CLOUDINARY,
    api_key: API_KEY_CLOUDINARY,
    api_secret: API_SECRET_CLOUDINARY
});

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');

// router.get('/numberofposts', requireLogin, (req,res)=>{
//     Post.find()
//     .then((posts)=>{
//         var allPost = posts.length;
//         var pri = 0;
//         posts.map(item=>{
//             if(item.privacy === "private"){
//                 pri = pri + 1;
//             }
//         })
//         var postData = {
//             allPost,
//             private: pri
//         }
//         res.json({posts: postData})
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// });

router.get('/allpost', requireLogin, (req,res)=>{
    Post.find({privacy: "public"})
    .populate("postedBy", "_id name pic priority")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt') //Descending Order '-createdAt'
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.get('/subpost', requireLogin, (req,res)=>{
    Post.find({postedBy: {$in: req.user.following}, privacy: "public"})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.post('/createpost', requireLogin, async (req,res)=>{
    const {title, body, pic, privacy} = req.body;
    // console.log(title, body, pic, privacy)
    if(!title || !body || !pic || !privacy){
        return res.status(422).json({
            error: "Please add all the fields."
        });
    }
    try{
        const picUploadedResponse = await cloudinary.uploader.upload(pic, {
            upload_preset: "the-gallery"
        });
        const picUrl = picUploadedResponse.url;
        const imagePublicId = picUploadedResponse.public_id;
        // console.log(picUploadedResponse)
        const post = new Post({
            title,
            body,
            photo: picUrl,
            photopublicid: imagePublicId,
            privacy,
            postedBy: req.user
        });
    
        post.save().then((result)=>{
            res.json({
                post: result
            })
        }).catch((err)=>{
            console.log(err);
        });
    }catch(err){
        console.log(err)
        return res.status(422).json({
            error: "Something went wrong, try again!"
        });
    };
});
router.get('/mypost', requireLogin, (req,res)=>{
    Post.find({postedBy: req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((myposts)=>{
        res.json({myposts});
    })
    .catch((err)=>{
        console.log(err);
    });
});
router.get('/editpost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id: req.params.postId})
    .then((post)=>{
        res.json({post})
    }).catch(err=>{
        return res.status(404).json({error: "Post not found."});
    })
});
router.put('/updatepost', requireLogin, (req,res)=>{
    const {title, body, postId} = req.body;
    if(!title || !body){
        return res.status(422).json({
            error: "Please add all the fields."
        })
    }else{
        Post.findByIdAndUpdate(postId,{
            title: title,
            body: body
        },{
            new: true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:"Something went wrong."});
            }else{
                res.json(result);
            }
        })
    }
});
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push: {likes: req.user._id}
    },{
        new: true
    }).populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
});
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull: {likes: req.user._id}
    },{
        new: true
    }).populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
});
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push: {comments: comment}
    },{
        new: true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
});
router.delete('/deletecomment/:postId/:commentId/:authorId',requireLogin,(req,res)=>{
    Post.findById(req.params.postId)
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString() || req.params.authorId === req.user._id.toString()){
            var comments = post.comments.filter(item=>{
            if(req.params.commentId !== item._id.toString()){
                return item
            }
            })
            Post.findByIdAndUpdate(req.params.postId,{
                comments: comments
            },{
                new: true
            }).populate("postedBy","_id name pic")
            .populate("comments.postedBy","_id name pic")
            .exec((err,result)=>{
                if(err){
                    return res.status(422).json({error:err});
                }else{
                    res.json(result);
                }
            })
        }
    })
})
router.put('/makepublic',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        privacy: "public"
    },{
        new: true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
});
router.put('/makeprivate',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        privacy: "private"
    },{
        new: true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })
});

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findById(req.params.postId)
    .populate("postedBy","_id priority")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if((post.postedBy._id.toString() === req.user._id.toString()) || (req.user.priority === "admin") || (req.user.priority === "owner")){
            if((post.postedBy.priority === "normal") || (post.postedBy.priority === "admin") || (post.postedBy.priority === "owner" && req.user.priority === "owner")){
                cloudinary.uploader.destroy(post.photopublicid, function(error,response) {
                    if(error){
                        return res.status(422).json({error})
                    }else{
                        post.delete()
                        .then(result=>{
                            res.json(result)
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                });
            }else{
                return res.status(422).json({error:"You don't have access to do!"});
            }
        }else{
            return res.status(422).json({error:"You don't have access to do!"});
        }
    })
})
module.exports = router;