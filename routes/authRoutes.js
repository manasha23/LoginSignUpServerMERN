const express=require('express'); //managing the routing
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const jwt=require('jsonwebtoken');

require('dotenv').config(); //to load environment variables from a .env file into the process.env object.
const bcrypt=require('bcrypt');

//SignUp post
router.post('/signup',(req,res)=>{
    //console.log(req.body);
    //res.send("This is signup page");
    const {name,email,password,dob} =req.body;
    if(!email || !password || !name || !dob ){
        return res.status(422).send({error: "Please fill all the fields"});
    } 
 
    User.findOne({ email: email}) 
//User is model or schema, findOne is a method provided by any ODM Library eg:Mongoose in case of MongoDB, { email: email }: This is the criteria or condition used to find the document/record. It specifies that you want to find a document/record where the email field matches the email variable. 
        .then(async (savedUser) => {
            //savedUser likely represents a user object retrieved from some asynchronous operation (e.g., querying a database).
            if(savedUser){
                return res.status(422).send({error: "Invalid Credentials"});
            }
            
            const user=new User({
                name,
                email,
                password,
                dob
            })

            try{

                await user.save();
                //res.send({message: "User saved successfully"}); //no token refer Notes.txt
                //console.log(process.env.JWT_SECRET);
                const token=jwt.sign({_id:user._id}, process.env.JWT_SECRET); //Generating Token _id:user._id: payload of the JWT...process.env allows you to store sensitive information like this in environment variables
                res.send({token})
            }
            catch (err) {
                console.log(err);
            }
        })
})

//post request for login as user gives you the details: email, password  
//Refer Notes.txt to know more about asyn and await
//here I'll get the email and password from frontend
router.post('/signin', async (req,res)=>{
    const{email, password} = req.body;
    //console.log(email);
    //console.log(password);
    if(!email || !password){
    return res.status(422).json({error:"Please add email or password"}); //If password not found
    }//optional
    const savedUser=await User.findOne({email:email}) //If the email is found in database

    if(!savedUser){
        return res.status(422).json({error:"Invalid Credentials"});
    }
    
    try{
        bcrypt.compare(password, savedUser.password, (err, result)=>{
            if(result){
                console.log("password matched");
                const token=jwt.sign({_id:savedUser._id}, process.env.JWT_SECRET); //Again for signin Generating Token _id:SavedUser._id: payload of the JWT...process.env allows you to store sensitive information like this in environment variables
                res.send({token})
            }
            else{
                return res.status(422).json({error:"Invalid Credential"});
            }
        })
    }
    catch(err){
        console.log(err);
    }



})


module.exports =router; 
