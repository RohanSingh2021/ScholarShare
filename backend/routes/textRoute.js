import express from "express"
import { createText, deleteText, getAllTexts, getFollowingTexts, likeOrDislike } from "../controllers/textController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.route("/create").post(isAuthenticated,createText);
// router.route("/create").post(isAuthenticated,createText);
router.route("/delete/:id").delete(isAuthenticated,deleteText);

router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route('/alltext/:id').get(isAuthenticated,getAllTexts);
router.route('/followingtext/:id').get(isAuthenticated,getFollowingTexts);

export default router;