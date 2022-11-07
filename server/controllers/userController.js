const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel')
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const generateToken = (id) => { 
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "1d"})
 }

const registerUser = asyncHandler( async(req,res)=>{
    const {name , email  ,password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    if(password.length < 6 ){
        res.status(400)
        throw new Error("Please enter a more secure password")
    }

    const userExists = await UserModel.findOne({email})

    if(userExists){ 
        throw new Error("Email has already been used.")
    }


    const user = await UserModel.create({
        name:name ,
        email: email ,
        password: password,
    })

    const token = generateToken(user._id)

    res.cookie("token", token , {
        path:"/",
        httpOnly: true,
        expires:new Date(Date.now() + 1000* 86400),
        sameSite:"none",
        secure:true
    })

    if(user){
        // const {id , name ,email , CV , bio } = user
        res.status(200).json({
            _id : user.id,
            name: user.name,
            email:user.email,
            cv: user.cv,
            phoneNo:user.phoneNo,
            description: user.description,
            token:token
        })
        
    }
    else{
        res.status(400)
        throw new Error("User not created")
    }
})



const loginUser = asyncHandler( async(req,res)=>{
    const {email , password} = req.body
    
    if(!email || !password){
        res.status(400)
        throw new Error("Please add email and password")
    }

    const user = await UserModel.findOne({email})
    if(!user){
        res.status(400)
        throw new Error("User not Found, Please Signup")
    }
    
    const passwordIsCorrect = await bcrypt.compare(password , user.password)
    const token = generateToken(user._id)

    res.cookie("token", token , {
        path:"/",
        httpOnly: true,
        expires:new Date(Date.now() + 1000* 86400),
        sameSite:"none",
        secure:false
    })

    if(user && passwordIsCorrect){
        res.status(200).json({
            _id : user._id,
            name: user.name,
            email:user.email,
            cv: user.cv,
            phoneNo:user.phoneNo,
            description: user.description,
            token:token
        })
    }
    else{
        res.status(400)
        throw new Error("Invalid Credentials")
    }
    
})
const logoutUser = asyncHandler( async(req,res)=>{
    res.cookie("token", "" , {
        path:"/",
        httpOnly: true,
        expires:new Date(0),
        sameSite:"none",
        secure:false
    })
    return res.status(200).json({
        message:"User successfully logged Out"
    })
})

const getUser = asyncHandler(async(req,res)=>{
    const user = await UserModel.findById(req.user._id)
    if(user){
    res.status(200).json({
        _id : user._id,
        name: user.name,
        email:user.email,
        cv: user.cv,
        phoneNo:user.phoneNo,
        description: user.description,
    })
    }
    else{
        res.status(400)
        throw new Error("User not Found")
    }
})


const loginStatus = asyncHandler(async(req,res)=>{
    const token = req.cookies.token
    if(!token){
        res.json(false)
    }
    else{
        const verified = jwt.verify(token , process.env.JWT_SECRET)
        if(verified){
           return res.json(true)
        }
        else{
            return res.json(false)
        }
    }
})

const updateUser = asyncHandler(async(req,res)=>{
    const user = await UserModel.findById(req.user._id)
    if(user){
        user.email = user.email
        user.name = req.body.name || user.name
        user.phoneNo = req.body.phoneNo || user.phoneNo
        user.cv = req.body.cv || user.cv
        user.description = req.body.description || user.description
        
        const updatedUser = await user.save()
        res.status(200).json({
        _id : updatedUser._id,
        name: updatedUser.name,
        email:updatedUser.email,
        cv: updatedUser.cv,
        phoneNo:updatedUser.phoneNo,
        description: updatedUser.description,
        })
    }
    else{
        res.status(400)
        throw new Error("User not Found")
    }
})
module.exports = {
    registerUser, loginUser ,logoutUser , getUser , loginStatus,updateUser
}