
import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password, img } = req.body;

    if (!name || !username || !email || !password || !img) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        message: "User already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      picture: img,
    });

    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
    
    try {
      await sendEmail(newUser.email, "Verify Email", url);
      return res.status(201).send({
        message: "An email sent to your account, please verify.",
        success: true,
      });
    } catch (error) {
      await User.findByIdAndDelete(newUser._id);
      await Token.findByIdAndDelete(token._id);
      return res.status(400).json({
        message: "Invalid email address.",
        success: false,
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User does not exist with this email.",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });

      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        
        try {
          await sendEmail(user.email, "Verify Email", url);
        } catch (error) {
          await Token.findByIdAndDelete(token._id);
          return res.status(400).json({
            message: "Invalid email address.",
            success: false,
          });
        }
      }

      return res.status(400).json({
        message: "An email has been sent to your account, please verify.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      message: `Welcome back ${user.name}!`,
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const logout = (req, res) => {
  return res.cookie("token", "", { expires: new Date(0) }).json({
    message: "User logged out successfully",
    success: true,
  });
};

export const bookmarks = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const textId = req.params.id;
    const user = await User.findById(loggedInUserId);
    
    if (user.bookmarks.includes(textId)) {
      await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: textId } });
      return res.status(200).json({
        message: "Removed from bookmark",
        success: true,
      });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: textId } });
      return res.status(200).json({
        message: "Added to bookmark",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

    if (!otherUsers.length) {
      return res.status(401).json({
        message: "No other users found",
        success: false,
      });
    }

    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });

      return res.status(200).json({
        message: `${loggedInUser.name} followed ${user.name}`,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: `User is already following ${user.name}`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });

      return res.status(200).json({
        message: `${loggedInUser.name} unfollowed ${user.name}`,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: `User is not following ${user.name}`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateBio = async (req, res) => {
  const userId = req.params.id;
  const { newBio } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { bio: newBio });
    return res.status(200).json({
      message: "Bio updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const Verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(400).json({ message: "Invalid link", success: false });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).json({ message: "Invalid link", success: false });

    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
