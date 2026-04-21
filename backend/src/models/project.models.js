import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "",
        localPath: "",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId, // means it will refer to another document and that document is user
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
