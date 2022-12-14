import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Homepage from './pages/Homepage';
import {Forgot , Login ,Register ,Reset} from './pages/auth/auth'
import Layout from './components/Layout/Layout';
import axios from 'axios'
import { Toaster } from 'react-hot-toast';
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLoginStatus } from './services/authService';
import { selectIsLoggedIn, SET_LOGIN } from './redux/features/auth/authSlice';
import AddProduct from './pages/AddProduct/AddProduct';
import Dashboard from './pages/Dashboard';
import ProductDetails from './components/Productdetails/ProductDetails';
import Product from './pages/SingleProduct/Product';
import NewReset from './pages/auth/NewReset';
import Profile from './pages/Profile/Profile';
axios.defaults.withCredentials = true

function App() {
const dispatch = useDispatch()
useEffect(() => {
  async function loginStatus(){
    const status = await getLoginStatus()
    console.log(status)
    dispatch(SET_LOGIN(status))
  }
  loginStatus()
}, [dispatch])
  


  return (
    <BrowserRouter>
    <Toaster
      position="top-right"
      reverseOrder={false}
/>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/forgotpassword' element={<Forgot />}/>
      {/* <Route path='/resetpassword/:resetToken' element={<Reset />}/> */}
      <Route path='/resetpassword/:resetToken' element={<NewReset />}/>
      <Route path='/add-product' element={<AddProduct/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/product/:id' element={<Product/>} />
      <Route path='/profile' element={<Profile/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
