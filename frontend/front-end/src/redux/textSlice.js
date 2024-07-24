import { createSlice } from "@reduxjs/toolkit";
const textSlice = createSlice({
    name:"text",
    initialState:{
        texts:null,
        refresh:false,
        isActive:true,
    },
    reducers:{
        getAllTexts:(state,action)=>{
            state.texts = action.payload;
        },
        getRefresh:(state)=>{
            state.refresh = !state.refresh;
        },
        getIsActive:(state,action)=>{
            state.isActive = action.payload;
        }
    }
});

export const {getAllTexts,getRefresh,getIsActive} = textSlice.actions;
export default textSlice.reducer;