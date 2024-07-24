import React from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

//Imp to destructure this prop. Wasted too much time here.

const RightSideBar = ({ otherUsers }) => {
  return (
    <div className="">
      <div className="flex items-center p-2 bg-gray-100 rounded-full outline-none w-full">
        <CiSearch size="20px" />
        <input
          type="text"
          className="bg-transparent outline-none px-2"
          placeholder="Search"
        />
      </div>
      <div className="p-4 bg-gray-100 rounded-2xl my-4">
        <h1 className="font-bold text-lg my-3">Explore</h1>
        {otherUsers?.map((user) => {
          return (
            <div key={user?._id} className="flex items-center justify-between">
              <div className="flex">
                <Avatar
                  src={user?.picture}
                  size="40"
                  round={true}
                />
                <div className="ml-2">
                  <h1 className="font-bold">{user?.name}</h1>
                  <p className="text-sm">{`@${user?.username}`}</p>
                </div>
              </div>
              <Link to={`/profile/${user?._id}`}>
                <button className="px-4 py-1 bg-[#09A0A9] text-white rounded-full">
                  Profile
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightSideBar;
