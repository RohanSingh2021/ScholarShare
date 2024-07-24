import {Text} from "../models/textSchema.js" 
import {User} from "../models/userSchema.js"
export const createText = async(req,res)=>{
    try {
        const {description, id} = req.body;
        if(!description || !id){
            return res.status(401).json({
                message:"All fields are required",
                success:false
            });
        };
        
        const user = await User.findById(id).select("-password");

        await Text.create({
            description,
            userId:id,
            userDetails:{
                name: user.name,
                username: user.username,
                picture: user.picture
            }
        });

        return res.status(201).json({
            message:"Text created successfully",
            success: true,
        })
          
    } catch (error) {
        console.log(error);
    }
}

export const deleteText = async(req,res)=>{
    try {
        const {id} = req.params;
        await Text.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Text has been deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

/*
Basically hum list me dekh rhe ki user ne pehle se like kara hua hai ya nahi. Agar kiya hua hai to uss like ko hata do, nahi to like rehne do.
*/

export const likeOrDislike = async(req,res)=>{
    try {
        const loggedInUserId = req.body.id;
        const textId = req.params.id;
        const text = await Text.findById(textId);
        if(text.like.includes(loggedInUserId)){
            //dislike
            await Text.findByIdAndUpdate(textId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"The Like has been removed",
                succes:true
            })
        }
        else{
            await Text.findByIdAndUpdate(textId,{$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"The Text has been liked",
                succes:true
            })
        }
    } catch (error) {
        console.log(error);
    }
}


export const getAllTexts  = async(req,res)=>{
    try {

        const id = req.params.id;
        const loggedInUser = await User.findById(id);  //Basically ye wala ek pe hi kaam kar rha.
        //But ye wala har ek array ke element pe jaake dekhega. to bahut saare promises return honge. Promise.all se saare promise ek saath resolve kar diye jaate hai.
        const loggedInUserTexts = await Text.find({userId:id});
        const followingUserTexts = await Promise.all(loggedInUser.following.map((otherUsers)=>{
            return Text.find({userId:otherUsers});
        }));

        return res.status(200).json({
            texts:loggedInUserTexts.concat(...followingUserTexts)
        })
    

    } catch (error) {
        console.log(error);
    }
}


export const getFollowingTexts = async (req,res)=>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTexts = await Promise.all(loggedInUser.following.map((otherUsers)=>{
            return Text.find({userId:otherUsers});
        }));

        return res.status(200).json({
            texts:[].concat(...followingUserTexts)
        });
    } catch (error) {
        console.log(error);
    }
}