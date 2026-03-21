const express = require('express')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:id', async(req,res)=>{
    const userId = req.params.id
    if(!userId){return res.status(404).json({message:"User Not Found"})}

    try{
        const getUser = await User.findById(userId).select('-password')
        if(!getUser){return res.status(404).json({message:"User Not Found"})}

        return res.status(200).json({message:"User Profile Fetched", getUser})
    }
    catch(error){
        return res.status(500).json({message:"Server Error"})
    }
})

router.patch('/:id',authMiddleware, async(req,res)=>{
    const userId = req.params.id
    if(!userId){return res.status(404).json({message:"User Not Found"})}

    const {name, username, bio, country, gender, profile_pic } = req.body

    try{
        const getUser = await User.findById(userId).select('-password')
        if(!getUser){return res.status(404).json({message:"User Not Found"})}

        if(userId !== req.user.id){
            return res.status(403).json({message:"Forbidden access"})
        }

        // update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, username, bio, country, gender, profile_pic },
            { new: true }
        ).select('-password')

        return res.status(200).json({message:"Profile updated", updatedUser})
    }
    catch(error){
        return res.status(500).json({message:"Server Error"})
    }

})

module.exports=router;