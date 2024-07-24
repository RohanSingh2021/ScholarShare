import React from "react";
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { TEXT_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/textSlice";
import axios from "axios";


function Text({text}) {

  const deleteTextHandler = async(id)=>{
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.delete(`${TEXT_API_END_POINT}/delete/${id}`);
      console.log(res);
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.res.data.message);
      console.log(error);
    }
  }

  const {user} = useSelector(store=>store.user);

  const dispatch = useDispatch();

  const likeOrDislikeHandler = async(id)=>{
    try {
      const res = await axios.put(`${TEXT_API_END_POINT}/like/${id}`,{id:user?._id},{
        withCredentials:true
      })
      dispatch(getRefresh());
      toast.success(res.data.message);

    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <div className="border-b border-gray-200">
      <div>
        <div className="flex p-4">
          <Avatar
          
            src = {text?.userDetails[0]?.picture}
            size="40"
            round={true}
          />
          <div className="ml-2 w-full">
            <div className="flex items-center ">
              <h1 className="font-bold ">{text?.userDetails[0]?.name}</h1>
              <p className="text-gray-500 text-sm ml-1">{`@${text?.userDetails[0]?.username}`}</p>
            </div>
            <div>
              <p>{text?.description}</p>
            </div>
            <div className="flex justify-between my-3">
              
              <div className="flex items-center ">
                <div onClick={()=>likeOrDislikeHandler(text?._id)} className="p-2 hover:bg-pink-200 rounded-full cursor-pointer"><CiHeart  size="24px"/></div>
                <p >{text?.like?.length}</p>
              </div>
              
              {
                user?._id === text?.userId &&(<div onClick={()=>deleteTextHandler(text?._id)} className="flex items-center ">
                  <div className="p-2 hover:bg-red-400 rounded-full cursor-pointer"><MdDeleteOutline size="24px" /></div>
                </div>)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Text;
