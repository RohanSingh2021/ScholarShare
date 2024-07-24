import React, { useState } from "react";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import axios from "axios"
import { TEXT_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getAllTexts, getIsActive, getRefresh } from "../redux/textSlice";

function CreatePost() {

  const [description,setDescription] = useState("");
  const {user} = useSelector(store=>store.user);
  const dispatch = useDispatch();
  const {isActive} = useSelector(store=>store.text);
  const submitHandler = async()=>{
    try {
      const res = await axios.post(`${TEXT_API_END_POINT}/create`,{description,id:user?._id},{
        withCredentials:true,
      });
      dispatch(getRefresh());
      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setDescription("");
  }

  const forYouHandler = () =>{
    dispatch(getIsActive(true));
  }

  const followingHandler = () =>{
    dispatch(getIsActive(false));
  }

  return (
    <div className="w-[100%]">
      <div>
        <div className="flex items-center justify-evenly border-b border-gray-200">
          <div onClick={forYouHandler} className={`${isActive ? "border-b-4 border-[#09A0A9]" : null} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}>
            <h1 className="font-semibold text-gray-600 text-lg">For You</h1>
          </div>
          <div onClick={followingHandler} className={`${!isActive ? "border-b-4 border-[#09A0A9]" : null} cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}>
            <h1 className="font-semibold text-gray-600 text-lg">Following</h1>
          </div>
        </div>
        <div className="m-4">
          <div className="flex items-center p-4">
            <div>
              <Avatar
                // src="https://pbs.twimg.com/profile_images/1562753500726976514/EPSUNyR3_400x400.jpg"
                src = {user?.picture}
                size="40"
                round={true}
              />
            </div>
            <input
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full outline-none border-none text-xl ml-2"
              type="text"
              placeholder="What is happening?"
            />
          </div>
          <div className="flex justify-between p-4 border-b border-gray-300">
            {/* <div>
              <CiImageOn size="24px"/>
            </div> */}
            <button onClick={submitHandler} className="bg-[#09A0A9] px-4 py-1 border-none rounded-full text-lg text-white">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
