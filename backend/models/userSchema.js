import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    bookmarks:{
      type:Array,
      default:[],
    },
    picture:{
      type: String,
      default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    bio:{
      type:String,
      default:"Hello Everyone!"
    },
    verified:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
