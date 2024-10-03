import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const LocationSchema = await new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "users",
    },
    location: [
      {
        latiTude: {
          type: String,
        },
        longiTude: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const LocationModel = await mongoose.model("locations", LocationSchema);
