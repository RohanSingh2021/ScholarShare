import axios from "axios"
import { TEXT_API_END_POINT} from "../utils/constant"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getMyProfile } from "../redux/userSlice";
import { getAllTexts } from "../redux/textSlice";

const useGetMyTexts = (id)=>{
    const dispatch = useDispatch();
    const {refresh,isActive} = useSelector(store=>store.text);

    const fetchMyTexts = async() =>{
        try {
            const res = await axios.get(`${TEXT_API_END_POINT}/alltext/${id}`,{
                withCredentials:true
            });
            console.log(res);
            dispatch(getAllTexts(res.data.texts));
        } catch (error) {
            console.log(error);
        }
    }

    const followingTextHandler = async() =>{
        
        try {
        
          axios.defaults.withCredentials = true;
          const res = await axios.get(`${TEXT_API_END_POINT}/followingtext/${id}`,{
            withCredentials:true,
          });
          console.log(res);
          dispatch(getAllTexts(res.data.texts));
        } catch (error) {
          console.log(error);
        }
      }

    useEffect(()=>{
        if(!isActive){
            followingTextHandler();
        }
        else{
            fetchMyTexts();
        }
        
    },[refresh,isActive]);

};


export default useGetMyTexts;