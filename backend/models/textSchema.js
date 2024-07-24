import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  like: {
    type: Array,
    default:[]
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    extended:true
  },
  userDetails:{
    type:Array,
    default:[]
  }
},{timestamps:true});


export const Text = mongoose.model("Text",textSchema);