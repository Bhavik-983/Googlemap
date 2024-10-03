import {
  generateAccessToken,
  generateRefreshToken,
  tokenId,
} from "../hepler/tokenHelper.js";
import { errorHelper } from "../hepler/errorHelper.js";
import { UserModel } from "../models/UserModels.js";
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";
import bcrypt from "bcrypt";
import message from "../utilities/messages/message.js";

export const userSignup = async (req, res) => {
  try {
    const data = req.body;
    const user = await UserModel.findOne({ email: data.email });
    if (user) return sendBadRequest(res, message.userAlreadyExist);

    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hashSync(data.password, 10),
    });
    await newUser.save();
    return sendSuccess(res, message.signupSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(res, "USER_SIGNUP"));
  }
};

export const userLogin = async (req, res) => {
  try {
    const data = req.body;

    const user = await UserModel.findOne({ email: data.email });
    if (!user) return sendBadRequest(res, message.userNotFound);

    if (!bcrypt.compareSync(data.password, user.password))
      return sendBadRequest(res, message.passwordInvalid);

    const accessTokenId = tokenId();
    const refreshTokenId = tokenId();

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken({ _id: user._id, accessTokenId }, "USER"),
      generateRefreshToken({ _id: user._id, refreshTokenId }, "USER"),
    ]);

    user.accessTokenId = accessTokenId;
    user.refreshTokenId = refreshTokenId;
    await user.save();
    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
      },
      message.loginSuccessfully
    );
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "USER_LOGIN"));
  }
};

export const userList = async (req, res) => {
  try {
    const users = await UserModel.find({});
    return sendSuccess(res, users);
  } catch (e) {
    return sendBadRequest(res, errorHelper(res, "USER_LIST"));
  }
};
