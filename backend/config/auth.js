

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

dotenv.config(); // Typically, you load dotenv at the entry point of your application

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default isAuthenticated;
