    const express = require('express')
    const authMiddleware = require('../middleware/authMiddleware')
    const Comment = require('../models/Comment')

    const router = express.Router()

    router.get('/:id/comments', async (req,res)=>{
        const postId = req.params.id
        if(!postId){ return res.status(404).json({message:"Invalid Post"})}
            
        try{
            const commentOnPost = await Comment.find({postId:postId}).populate('user', 'username name');
            res.status(200).json({message:"Comments fetched successfully.", commentOnPost})

        }
        catch(error){
            return res.status(500).json({message:"Server error"})
        }
    })

    router.post('/:id/comments',authMiddleware, async (req,res)=>{
        const postId = req.params.id
        if(!postId){ return res.status(404).json({message:"Invalid Post"})}

        const { comment } = req.body
        const userCommenting = req.user.id
        try{
            if(!comment || !userCommenting){return res.status(400).json({message:"Invalid Method to comment"})}

            const commentWritten = new Comment({
                comment: comment,
                user: userCommenting,
                postId,
            })

            await commentWritten.save()
            return res.status(200).json({message:"Comment made"})
        }
        catch(error){
            return res.status(500).json({message:"Server error"})
        }

    })

    router.delete('/:id/comments/:commentId',authMiddleware, async (req,res)=>{
        const commentId = req.params.commentId
        if(!commentId){ return res.status(404).json({message:"Comment does not exist"})}

        try{
            const commentToDelete = await Comment.findById(commentId)
            if(!commentToDelete){
                return res.status(404).json({message:"Comment not found"})
            }
            if(req.user.id==commentToDelete.user.toString()){
                await Comment.findByIdAndDelete(commentId)
                return res.status(200).json({message:"Comment Deleted"})
            }
            else{
                return res.status(403).json({message:"Forbidden access"})
            }
        }
        catch(error){
            return res.status(500).json({message:"Server Error"});
        }
    })

    module.exports=router;