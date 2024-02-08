
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    name: {
              type: String,
              required: true
            },
    email: {
             type: String,
             required: true,
             unique: true,
           },
  password: {
           type: String,
           required: true
         },
  dob: {
        type: String,
        required: true
        }

})

//Before saving secure the password
//save method 
userSchema.pre('save', async function (next){
        const user = this;
        //console.log('Just before saving', user.password);
        //hash the user.password
        if(!user.isModified('password')){
          return next();
        }
        user.password=await bcrypt.hash(user.password, 8)
        console.log("Just before saving & after hashig", user.password);
        next();
        })

//     user.password=await bcrypt.hash(user.password,8);
//     console.log("Just before saving ")
//     next();



mongoose.model("User",userSchema);