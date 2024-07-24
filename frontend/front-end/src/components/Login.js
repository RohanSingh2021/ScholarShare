
import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      toast.error("Please select an Image");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "twitter-clone");
      data.append("cloud_name", "dnxti4qdc");

      fetch("https://api.cloudinary.com/v1_1/dnxti4qdc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImg(data.url.toString());
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to upload image");
          setLoading(false);
        });
    } else {
      toast.error("Please select a JPEG or PNG image");
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginSignupHandler = () => {
    setIsLogin(!isLogin);
  };

  const submithandler = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && (!name || !username || !img))) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        dispatch(getUser(res?.data?.user));
        if (res.data.success) {
          navigate("/");
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } else {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          { name, username, email, password, img },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          navigate("/");
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex items-center justify-evenly w-[80%]">
        <div className="ml-4">
          <img
            width={300}
            src="scholarshare.jpg"
            alt="scholarshare-logo"
          />
        </div>
        <div>
          <div className="my-5">
            <h1 className="font-bold text-5xl">Record.Reflect.Inspire. </h1>
          </div>
          <h1 className="mt-4 mb-2 text-2xl font-bold">
            {isLogin ? "Login" : "Signup"}
          </h1>
          <form onSubmit={submithandler} className="flex flex-col w-[75%]">
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="UserName"
                  className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold"
            />
            {!isLogin && (
              <div>
                <h1 className="py-3 font-bold text-gray-500">
                  Please Upload the Profile Photo
                </h1>
                <input
                  type="file"
                  onChange={(e) => postDetails(e.target.files[0])}
                ></input>
              </div>
            )}
            <button
              className="bg-[#09A0A9] border-none rounded-full py-2 my-4 text-lg text-white"
              disabled={loading}
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
            <h1>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={loginSignupHandler}
                className="cursor-pointer text-blue-600 font-bold"
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
