
import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import useGetProfile from "../hooks/useGetProfile";
import toast from "react-hot-toast";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { followingUpdate, updateBio } from "../redux/userSlice";
import { getRefresh } from "../redux/textSlice";

function Profile() {
  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  useGetProfile(id);
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(false);
  const [newBio, setNewBio] = useState(profile?.bio || "");

  const followAndUnfollowHandler = async () => {
    if (user.following.includes(id)) {
      // unfollow
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {
          id: user?._id,
        });
        console.log(res);
        dispatch(followingUpdate(id));
        dispatch(getRefresh());
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    } else {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {
          id: user?._id,
        });
        console.log(res);
        dispatch(followingUpdate(id));
        dispatch(getRefresh());
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  };

  const clickedHandler = () => {
    setClicked(!clicked);
  };

  const bioUpdateHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${USER_API_END_POINT}/updatebio/${id}`, {
        newBio,
      });
      toast.success("Bio updated successfully");
      setClicked(false);
      dispatch(updateBio(newBio));
    } catch (error) {
      toast.error("Failed to update bio");
      console.log(error);
    }
  };

  return (
    <div className="w-[50%] border-l border-r border-gray-200">
      <div>
        <div className="flex items-center py-2">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
          >
            <IoMdArrowBack size="24px" />
          </Link>
          <div>
            <h1 className="font-bold text-lg">{profile?.name}</h1>
          </div>
        </div>
        
        <div className="absolute top-[5%] left-[45%] ml-2 border-4 border-white rounded-full">
          <Avatar
            src={profile?.picture}
            size="7.5rem"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          {profile?._id === user?._id ? (
            <button
              onClick={clickedHandler}
              className="px-4 py-1 rounded-full border"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={followAndUnfollowHandler}
              className="px-4 py-1 bg-black text-white rounded-full"
            >
              {user.following.includes(id) ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <div className="m-4">
          <h1 className="font-bold text-xl">{profile?.name}</h1>
          <p>{`@${profile?.username}`}</p>
        </div>
        <div className="m-4 text-sm">
          {clicked ? (
            <form onSubmit={bioUpdateHandler}>
              <input
                type="text"
                placeholder="Click here to enter the Bio!"
                className="border-gray-300"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <button type="submit" className="ml-2 px-4 py-1 rounded-full border">
                Save
              </button>
            </form>
          ) : (
            <p>{profile?.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
