import { errorHelper } from "../hepler/errorHelper.js";
import { LocationModel } from "../models/LocationModels.js";
import { sendDataToAgent } from "../sockets/index.js";
import message from "../utilities/messages/message.js";
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";

export const addLocation = async (req, res) => {
  try {
    const location = await LocationModel.findOne({ userId: req.user._id });
    if (location) {
      location.location = [...location.location, ...req.body.location];
      await location.save();
      const data = {
        userId: location.userId,
        location: req.body.location,
      };
      console.log("old", data, "old");
      await sendDataToAgent("USER_LOCATION", "location_data", data);
      return sendSuccess(res, message.locationAddSuccessfully);
    }
    const newLocation = await new LocationModel({
      userId: req.user._id,
      location: req.body.location,
    });
    console.log("new", newLocation, "new");
    await newLocation.save();
    await sendDataToAgent("USER_LOCATION", "location_data", newLocation);
    return sendSuccess(res, message.locationAddSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "ADD_LOCATION"));
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const existLocation = await LocationModel.findOne({
      userId: req.params.userId,
    });
    return sendSuccess(res, existLocation);
  } catch (e) {
    return sendBadRequest(res, errorHelper(res, "GET_USER_LOCATION"));
  }
};
