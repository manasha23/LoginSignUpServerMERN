const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const User=mongoose.model("User");

require('dotenv').config();
//next thing to do
module.exports = (req,res,next) =>{  //get request 
const {authorization} = req.headers;
//This line extracts the value of the Authorization header from the incoming request's headers. The Authorization header typically contains the JWT for authentication.
//console.log(authorization);
if(!authorization){
    return res.status(401).send({error: "You must be logged in , key not given"});
}
const token =authorization.replace("Bearer ",""); //To remove the bearer
//console.log(token);

jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
    if (err) {
        return res.status(401).json({ error: "You must be logged in, token invalid" });
    }
    //after verifing the token then take the id from payload then check whether the if it is correct
    const {_id}=payload;
    User.findById(_id).then(userdata => {
        req.user = userdata;
        //console.log(req.user);
        //This is a common pattern in Express.js to attach additional data to the req object, making it accessible in subsequent middleware or route handlers.
        next();
    })
});
 //Verifing the jwt token
next(); //follow up page
}