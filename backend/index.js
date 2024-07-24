import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import textRoute from "./routes/textRoute.js";
import cors from "cors";

dotenv.config({
  path: ".env",
});

databaseConnection();
const app = express();

//middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

//api
app.use("/api/v1/user", userRoute); //See this explanation.

app.use("/api/v1/text", textRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
