import express from "express";
import {
  userList,
  userLogin,
  userSignup,
} from "../controllers/UserController.js";
const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.get("/list", userList);

export default router;
