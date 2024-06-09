import { Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { LogOut } from '../redux/auth/auth.actions'

const Navbar = () => {
  const { isAuth } = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  const handleLogOut = () => {
    // Dispatch the logOut action when the "Log Out" button is clicked
    dispatch(LogOut());
  };

  return (
    <HStack spacing='70px' backgroundColor={"teal"} justifyContent="center" py="5">
      <Text color={"black"} fontSize="20px">
        {isAuth ? "" : <NavLink to="/">Sign Up</NavLink>}
      </Text>
      <Text color={"black"} fontSize="20px">
        {isAuth ? <Button onClick={handleLogOut}>Log Out</Button> : <NavLink to="/login">Log In</NavLink>}
      </Text>
      <Text color={"black"} fontSize="20px">
        <NavLink to="/product-page">Product Page</NavLink>
      </Text>
    </HStack>
  )
}

export default Navbar
