import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config({
    path:"../config/.env"
})

// console.log('MONGO_URI:', process.env.MONGO_URI);

const databaseConnection = () =>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB connected");
    }).catch((error)=>{
        console.log(error);
    })
}

export default databaseConnection;