const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
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

router.post('/login', async (req,res)=>{
    const{ email, password } = req.body;
    try{
        const foundUser = await User.findOne({email:email});
        if(!foundUser){
            console.log("user found");
            return res.status(400).json({message:"Invalid credentials."});
        }
        const isMatch = await bcryptjs.compare(password, foundUser.password);
        if(!isMatch){
            console.log("pass matched found");
            return res.status(400).json({ message: "Invalid credentials" });
        }
        else{
            const token=jwt.sign(
                { id: foundUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '5d' },
            )
            res.status(200).json({ token, message: "Login successful" });
        }
    }
    catch(error){
        res.status(500).json({message: "Server down."});
    }
})

router.get('/protected', authMiddleware, (req, res)=>{
    res.json({message:"User logged in!"});
})

module.exports = router;

