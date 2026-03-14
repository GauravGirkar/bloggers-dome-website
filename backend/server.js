const express=require(`express`);
const cors =require('cors');

const app=express();

const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use("/", (req,res,next)=>{
    console.log("Home page loaded!");
    res.status(200).json({message:"API running"});
})


app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
    
})
