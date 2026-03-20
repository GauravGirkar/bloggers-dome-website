const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');

router.get('/', async (req,res)=>{
    try{
        const postFetched = await Post.find().populate('author','name username profile_pic');
        res.status(200).json({message:"Posts fetched successfully.", postFetched})
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const postId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(postId)){
            return res.status(404).json({message:"Post not found!"});
        }
        const postFetched = await Post.findById(postId).populate('author', 'name username profile_pic');
        if(!postFetched){return res.status(404).json({message:"Post not found!"})}
        res.status(200).json({message:"Post fetched successfully.", postFetched})
    }
    catch(error){
        res.status(500).json({message:"Server error", error})
    }
})

router.post('/create', authMiddleware, async (req,res)=>{
    const { title, content, image} = req.body;
    const author = req.user.id; 
    try{
        if(!title || !content || !author){
            return res.status(400).json({message:"Invalid Data"});
        }
        else{
            const postCreated = new Post({
                title,
                content,
                image,
                author,
            })

            await postCreated.save();
            return res.status(201).json({message:"Post created successfully!"});
        }
    }
    catch(error){
        return res.status(500).json({message:"Internal Server Error", error: error.message});
    }
})

router.put('/:id', authMiddleware, async(req, res)=>{

})

router.delete('/:id', authMiddleware, async(req,res)=>{

})

module.exports = router;