//Refer MongoDB login
const express= require('express');

const app=express();
const bodyParser=require('body-parser')

require('./db');
require('./models/User');

const authRoutes=require('./routes/authRoutes');
const requireToken = require('./Middleware/AuthTokenRequired')//Getting the token from the header

app.listen(3000,()=>{
    console.log('Server is running on port');
})

app.use(bodyParser.json());//Return everything in JSON
app.use(authRoutes);

app.get('/',requireToken,(req,res)=>{
    console.log(req.user);  //Unable to get here
    res.send(req.user);
    //res.send("This is home page")
})

//To get the user's input