import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = await new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    accessTokenId: {
      type: String,
    },
    refreshTokenId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const UserModel = await mongoose.model("users", UserSchema);
