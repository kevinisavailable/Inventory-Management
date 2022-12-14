import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import { createProduct, deleteProduct, getAProduct, getProductsUser } from './productService';
import {toast} from 'react-hot-toast'
const initialState = {
    product: null,
    products :[],
    isError: false,
    isSuccess :false,
    isLoading :false,
    message:""
}

export const createNewProduct = createAsyncThunk(
    "products/create", 
    async(formData , thunkAPI)=>{
        try{
            return await createProduct(formData)
        }
        catch(error){
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() 
            console.log(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getProducts = createAsyncThunk(
    "products/getproducts", 
    async(_ , thunkAPI)=>{
        try{
            return await getProductsUser()
        }
        catch(error){
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() 
            console.log(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteSingleProduct = createAsyncThunk(
    "products/delteproduct", 
    async(id, thunkAPI)=>{
        try{
            return await deleteProduct(id)
        }
        catch(error){
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() 
            console.log(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getSingleProduct = createAsyncThunk(
    "products/getproduct", 
    async(id, thunkAPI)=>{
        try{
            return await getAProduct(id)
        }
        catch(error){
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() 
            console.log(message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    CALCULATE_STORE_VALUE(state , action){
        console.log("store Value")
    }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(createNewProduct.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(createNewProduct.fulfilled , (state , action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        console.log(action.payload)
        state.products.push(action.payload)
        toast.success("Product added successfully")
    })
    .addCase(createNewProduct.rejected , (state , action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
    })

    .addCase(getProducts.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(getProducts.fulfilled , (state , action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        // console.log(action.payload)
        state.products = action.payload
    })
    .addCase(getProducts.rejected , (state , action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
    })

    .addCase(deleteSingleProduct.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(deleteSingleProduct.fulfilled , (state , action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        // console.log(action.payload)
        toast.success("Product has been deleted")
    })
    .addCase(deleteSingleProduct.rejected , (state , action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
    })

    .addCase(getSingleProduct.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(getSingleProduct.fulfilled , (state , action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.product = action.payload
        toast.success("Product Fetched Successfully")
        // console.log(action.payload)
    })
    .addCase(getSingleProduct.rejected , (state , action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        toast.error(action.payload)
    })
  }
});

export const {CALCULATE_STORE_VALUE} = productSlice.actions
export const selectIsLoading = (state) =>state.product.isLoading
export default productSlice.reducer