const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req,res)=>{
    const{ name, email, password, username } = req.body;
    try{
        if(await User.findOne({$or:[{email: email},{username: username}]})){
            res.status(400).json({ message: "User already exists in the database" });
        }
        else{
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new User ({
                username,
                email, 
                name,
                password: hashedPassword,
            })
            await newUser.save();
            res.json({message: "User created and stored in DB"});

        }
    }catch(error){
            res.status(500).json({ message: "Server error", error: error.message });
    }
})

module.exports = router;

