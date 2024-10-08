import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { config } from "../config/index.js";
import logger from "../utilities/logger.js";
import messages from "../utilities/messages/message.js";
import config from "../config/index.js";

export const generateAccessToken = (data, role) => {
  switch (role) {
    case "ADMIN":
      return jwt.sign(data, config.ADMIN_SECRET, { expiresIn: "1d" });
    case "USER":
      return jwt.sign(data, config.USER_SECRET, { expiresIn: "1d" });
    default:
      return null;
  }
};

export const tokenId = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const validateAccessToken = async (token) => {
  try {
    const tokenInfo = await jwt.verify(token, config.USER_SECRET);
    return tokenInfo;
  } catch (e) {
    return null;
  }
};

export const returnTokenError = (e) => {
  if (String(e).includes("jwt expired")) {
    return "Token Expired";
  } else if (String(e).includes("invalid token")) {
    return messages.invalidToken;
  } else if (String(e).includes("jwt malformed")) {
    return messages.invalidToken;
  } else if (String(e).includes("invalid signature")) {
    return messages.invalidToken;
  } else {
    // logger.error("IS_ADMIN");
    // logger.error(e);
    return messages.somethingGoneWrong;
  }
};

export const generateRefreshToken = (data, role) => {
  switch (role) {
    case "ADMIN":
      return jwt.sign(data, config.ADMIN_REFRESH_SECRET, { expiresIn: "1d" });
    case "USER":
      return jwt.sign(data, config.USER_REFRESH_SECRET, { expiresIn: "1d" });
    default:
      return null;
  }
};
