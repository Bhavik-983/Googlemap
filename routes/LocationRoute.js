import express from "express";
import {
  addLocation,
  getUserLocation,
} from "../controllers/LocationController.js";
import { isUser } from "../middleware/user_validator.js";

const router = express.Router();

router.post("/add", isUser, addLocation);

router.get("/list/:userId", getUserLocation);

export default router;
