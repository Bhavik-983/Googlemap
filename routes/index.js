import express from "express";
import healthRoute from "./health/index.js";
import UserRoute from "./UserRoute.js";
import LocationRoute from "./LocationRoute.js";
const router = express.Router();

/* GET home page. */

//like router use like this
router.use("/health", healthRoute);
router.use("/user", UserRoute);
router.use("/location", LocationRoute);

export default router;
