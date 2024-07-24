import { createSlice } from "@reduxjs/toolkit"; 

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        otherUsers: null,
        profile:null
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        getOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        getMyProfile:(state,action)=>{
            state.profile = action.payload;
        },
        followingUpdate:(state,action)=>{
            if(state.user.following.includes(action.payload)){
                state.user.following = state.user.following.filter((itemId)=>{
                    return itemId !== action.payload;
                })
            }
            else{
                state.user.following.push(action.payload);
            }
        },
        updateBio: (state, action) => {
            if (state.profile) {
              state.profile.bio = action.payload;
            }
            if (state.user && state.user._id === state.profile._id) {
              state.user.bio = action.payload;
            }
        },
    }
});

export const { getUser, getOtherUsers,getMyProfile,followingUpdate,updateBio } = userSlice.actions;
export default userSlice.reducer;
