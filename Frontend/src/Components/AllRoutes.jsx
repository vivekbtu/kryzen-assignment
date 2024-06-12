import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Privateroutes from './PrivateRoutes'
import SignUp from '../pages/SignUp'
import Login from '../pages/Login'
import ProductPage from '../pages/ProductPage'

const AllRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/:userUID/product-page" element={<Privateroutes><ProductPage /></Privateroutes>} />
   </Routes>
  )
}

export default AllRoutes