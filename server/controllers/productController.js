const AsyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const { fileSizeFormatter } = require('../utils/fileUpload')
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: 'djrs0ka4f', 
    api_key: '532312434813529', 
    api_secret: 'v_9JCqNRwDg1a4bz-Zh42uC3g4k' 
  });

const createProduct = AsyncHandler(async(req,res)=>{
    const {name, sku, category , quantity , price , description}  = req.body  
    if(!name || !category || !quantity || !price || !description){
        res.status(400)
        throw new Error("Please fill in all Fields")
    }

    let fileData = {}
    if(req.file){

        let uploadedFile
        try{
            uploadedFile = await cloudinary.uploader.upload(req.file.path , {folder:"Interview Management" , resource_type:"raw"})
        }
        catch(error){
            res.status(500)
            throw new Error("File could not be uploaded")
        }

        fileData = {
            fileName : req.file.originalname,
            filePath : uploadedFile.secure_url,
            fileType : req.file.mimetype,
            fileSize : fileSizeFormatter(req.file.size , 2)
        }
    }
    
    const product  = await Product.create({
        user: req.user.id,
        name: name,
        sku: sku,
        category: category,
        price :price,
        quantity:quantity,
        description:description,
        image : fileData
    })
    res.status(201).json({
        product
    })
})

const getAllProducts =AsyncHandler( async(req,res)=>{
    const products = await Product.find({user:req.user.id}).sort("-createdAt")
    res.status(200).json(products)
})

const getSingleProduct = AsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(404)
        throw new Error("Product Not Found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("User not authorized")
    }

    res.status(200).json(product)
})

const deleteProduct = AsyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(404)
        throw new Error("Product Not Found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("User not authorized")
    }

    await product.remove()
    res.status(200).json({
        message:"Product deleted."
    })
})

const updateProduct = AsyncHandler(async(req,res)=>{
    
    const {name, category , quantity , price , description}  = req.body  
    const product = await Product.findById(req.params.id)

    if(!product){
        res.status(400)
        throw new Error("Product not Found")
    }
    
    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("User not authorized")
    }
    
    let fileData = {}

    if(req.file){
        let uploadedFile
        try{
            uploadedFile = await cloudinary.uploader.upload(req.file.path , {folder:"Interview Management" , resource_type:"raw"})
        }
        catch(error){
            res.status(500)
            throw new Error("File could not be uploaded")
        }

        fileData = {
            fileName : req.file.originalname,
            filePath : uploadedFile.secure_url,
            fileType : req.file.mimetype,
            fileSize : fileSizeFormatter(req.file.size , 2)
        }
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        {
        _id:req.params.id
        },
        {
        name: name,
        category: category,
        price :price,
        quantity:quantity,
        description:description,
        image :  Object.keys(fileData).length === 0 ? product?.image : fileData
        },
        {
        new : true , 
        runValidators : true
        })

    res.status(200).json({
        updatedProduct
    })
})
module.exports ={
    createProduct , getAllProducts,getSingleProduct , deleteProduct,updateProduct
}