require('dotenv').config();
require('./db.js');
const express=require(`express`);
const cors =require('cors');
const authRoutes = require('./routes/auth.js');
const postRoutes = require('./routes/posts.js');
const commentRoutes = require('./routes/comment.js');

const app=express();


const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use("/", (req,res,next)=>{
    console.log("Home page loaded!");
    res.status(200).json({message:"API running"});
})


app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
    
})
