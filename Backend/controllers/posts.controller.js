import Comment from "../models/comments.model.js"
import Post from "../models/posts.model.js"
import User from "../models/user.model.js"


export const activeCheck = async (req, res) =>{
    return res.status(200).json({message: 'RUNNING'})
}


export const createPost = async (req, res) =>{
    try {
        const {token} = req.body
        const user = await User.findOne({token})
        if(!user){
            return res.status(404).json({message: "User not found."})
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined? req.file.filename : "",
            fileType: req.file != undefined? req.file.mimetype.split("/")[1] : ""
        })

        await post.save()

        return res.status(200).json({message : "Post created."})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name username email profilePicture');
        return res.json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




export const deletePost = async (req, res) =>{
    try {
        const {token, post_id} = req.body
        const user = await User
            .findOne({token})
            .select('_id')
        
        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }

        const post = await Post.findOne({_id: post_id})

        if(!post){
            return res.status(404).json({message: 'Post not found.'})
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(404).json({message : 'Unauthorized!'})
        }
         
        await Post.deleteOne({_id : post_id })

        return res.json({message : 'Post Deleted.'})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}




export const commentPost = async (req, res) =>{
    try {
        const {token, post_id, commentBody} = req.body
        const user = await User.findOne({token}).select('_id')
        if(!user) {
            return res.status(404).json({message: 'User not found.'})
        }

        const post = await Post.findOne({_id: post_id})
        if(!post) {
            return res.status(404).json({message: 'Post not found.'})
        }

        const commentToPost = new Comment({
            userId: user._id,
            postId: post._id,
            comment: commentBody
        })
        await commentToPost.save();
        
        return res.json({message: 'Comment added.'})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}



export const getCommentByPost = async (req,res) =>{
    try {
        const {post_id} = req.query
        const post = await Post.findOne({_id : post_id})
        if(!post){
            return res.status(404).json({message: 'Post not found.'})
        }
        const comment = await Comment.find({postId: post._id})
            .populate('userId', 'username name')
            
        return res.json(comment.reverse())

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}



export const deleteCommentOfUser = async (req, res) =>{
    try {
        const {token, comment_id} = req.body
        const user = await User.findOne({token}).select('_id')
        
        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }

        const comment = await Comment.findOne({_id: comment_id})

        if(!comment){
            return res.status(404).json({message: 'Comment not found.'})
        }

        if(user._id.toString() !== comment.userId.toString()){
            return res.status(404).json({message: 'Unauthorized.'})
        }

        await Comment.deleteOne({_id: comment_id})

        return res.json({message: 'Comment deleted.'})

    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}


export const incrementLikes = async (req, res) =>{
    try {
        const {token, post_id} = req.body
        const user = await User.findOne({token})
        
        if(!user){
            return res.status(404).json({message: 'User not found.'})
        }
        
        const post = await Post.findOne({_id: post_id})
        if(!post){
            return res.status(404).json({message: 'Post not found.'})
        }
        post.likes = post.likes + 1

        await post.save()

        return res.json({message: 'Likes incremented.'})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}