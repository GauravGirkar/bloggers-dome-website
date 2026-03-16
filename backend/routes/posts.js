const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req,res)=>{

})

router.get('/:id', async (req,res)=>{

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