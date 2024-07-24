import React from "react";
import { CiHome } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import {Link, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, getUser } from "../redux/userSlice";

const LeftSideBar = () => {
  const {user} = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async() =>{
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      toast.success(res.data.message);
      dispatch(getUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-[20%]">
      <div>
        <div className="ml-4">
          <img
            width={24}
            src = "https://upload.wikimedia.org/wikipedia/en/c/c2/Motilal_Nehru_National_Institute_of_Technology_Allahabad_logo.png"
            alt="MNNIT-logo"
          />
        </div>
        <Link to="/" className="my-4">
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <CiHome size="24px"/>
            </div>
            <div>
              <h1 className="font-bold text-lg ml-2">Home</h1>
            </div>
          </div>
        </Link>
        {/* <div className="my-4">
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <CiHashtag size="24px"/>
            </div>
            <div>
              <h1 className="font-bold text-lg ml-2">Explore</h1>
            </div>
          </div>
        </div> */}
        {/* <div className="my-4">
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <IoIosNotificationsOutline  size="24px"/>
            </div>
            <div>
              <h1 className="font-bold text-lg ml-2">Notifications</h1>
            </div>
          </div>
        </div> */}
        <Link to={`/profile/${user?._id}`} className="my-4">
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <CiUser   size="24px"/>
            </div>
            <div to="profile">
              <h1 className="font-bold text-lg ml-2">Profile</h1>
            </div>
          </div>
        </Link>
        {/* <div className="my-4">
          <div className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <CiBookmark size="24px"/>
            </div>
            <div>
              <h1 className="font-bold text-lg ml-2">Bookmarks</h1>
            </div>
          </div>
        </div> */}
        <div className="my-4">
          <div onClick={logoutHandler} className="flex items-center my-2 px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-full">
            <div>
              <IoMdLogOut  size="24px"/>
            </div>
            <div>
              <h1 className="font-bold text-lg ml-2">Logout</h1>
            </div>
          </div>
        </div>
        {/* <button className="px-4 py-2 border-none text-md bg-[#52A8E7] w-full rounded-full text-white font-bold">Post</button> */}
      </div>
    </div>
  );
};

export default LeftSideBar;
