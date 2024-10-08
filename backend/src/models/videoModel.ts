import mongoose, { Document, Model, Schema } from "mongoose";
export interface Ivideo extends Document {
  title?: string;
  description?: string;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  key: string;
  isPrivate: boolean;
  thumbNail?: string;
}

const videoSchema: Schema = new Schema(
  {
    title: { type: String, default: "Title of the video " },
    description: { type: String, default: "Default description of the video" },
    path: { type: String, required: true },
    key: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: { type: Boolean, default: false },
    thumbNail: {
      type: String,
      default:
        "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200214165928/Web-Development-Course-Thumbnail.jpg",
    },
  },
  { timestamps: true }
);

// Adding an index to the uploadedBy field
videoSchema.index({ uploadedBy: 1 });

const Video: Model<Ivideo> = mongoose.model<Ivideo>("Video", videoSchema);

export default Video;
