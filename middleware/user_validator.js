import {
  returnTokenError,
  validateAccessToken,
} from "../hepler/tokenHelper.js";
import { UserModel } from "../models/UserModels.js";
import message from "../utilities/messages/message.js";
import { sendBadRequestWith406Code } from "../utilities/response/index.js";

export const isUser = async (req, res, next) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization;
    // if token find then verify
    if (!bearerToken)
      return sendBadRequestWith406Code(res, message.authTokenRequired);
    const tokenInfo = await validateAccessToken(
      String(bearerToken).split(" ")[1]
    );
    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo?._id)
      return sendBadRequestWith406Code(res, message.tokenFormatInvalid);

    const userDetails = await UserModel.findOne({
      _id: tokenInfo?._id,
    });

    if (!userDetails)
      return sendBadRequestWith406Code(res, message.userNotFound);

    if (userDetails?.accessTokenId !== tokenInfo?.accessTokenId)
      return sendBadRequestWith406Code(res, message.accessTokenIsNotValid);
    // Attach Admin Info
    req.user = userDetails;
    // next for using this method only
    next();
  } catch (e) {
    const error = await returnTokenError(e, "IS_USER");
    if (error !== message.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error);
    } else {
      return sendBadRequestWith406Code(res, error);
    }
  }
};

export const isValidUser = async (socket, next) => {
  try {
    if (socket.handshake.auth.authorization) {
      if (!(socket.handshake.auth && socket.handshake.auth.authorization))
        return next(new Error("Authentication error")); // Auth token required
      let tokenInfo;
      const tokenInformation = await validateAccessToken(
        socket.handshake.auth.authorization,
        "USER"
      );
      if (tokenInformation) tokenInfo = tokenInformation;
      if (!(tokenInfo && tokenInfo._id))
        return next(new Error(messages.tokenFormatInvalid)); // Validate token
      socket.userId = tokenInfo._id;
      next();
    }
    if (socket.handshake.headers.authorization) {
      if (!(socket.handshake.headers && socket.handshake.headers.authorization))
        return next(new Error("Authentication error")); // Auth token required

      let tokenInfo;
      const tokenInformation = await validateAccessToken(
        socket.handshake.headers.authorization,
        "USER"
      );
      if (tokenInformation) tokenInfo = tokenInformation;
      if (!(tokenInfo && tokenInfo._id))
        return next(new Error(messages.tokenFormatInvalid)); // Validate token
      socket.userId = tokenInfo._id;
      next();
    }
  } catch (e) {
    if (String(e).includes("jwt expired")) {
      return next(new Error(messages.tokenExpiredError));
    } else if (String(e).includes("invalid token")) {
      return next(new Error(messages.invalidToken));
    } else if (String(e).includes("jwt malformed")) {
      return next(new Error(messages.invalidToken));
    }
    logger.error("IS_USER_FOR_SOCKET");
    logger.error(e);
    next(new Error("Authentication error"));
  }
};
