const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/Signup-react-db")

connect.then(() =>{
    console.log("Database connected successfully");
})
.catch(()=>{
    console.log("Database cannot be connected");
});
