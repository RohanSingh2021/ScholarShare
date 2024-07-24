import React, { useEffect } from 'react'
import LeftSideBar from './LeftSideBar'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import {Outlet, useNavigate} from "react-router-dom"
import useOtherUsers from '../hooks/useOtherUsers'
import { useSelector } from 'react-redux'
import useGetMyTexts from '../hooks/useGetMyTexts'


const Home = () => {

  const {user,otherUsers}  = useSelector(store=> store.user);
  const navigate = useNavigate();

  //See on the web why we are placing it in the useEffect.
  useEffect(()=>{
    if(!user){
      navigate("/login")
    }
  },[]);

  useOtherUsers(user?._id);
  useGetMyTexts(user?._id);

  return (
    <div className='flex justify-between w-[80%] mx-auto'> 
        <LeftSideBar/>
        <Outlet/>
        <RightSideBar otherUsers = {otherUsers}/>
    </div>
  )
}

export default Home