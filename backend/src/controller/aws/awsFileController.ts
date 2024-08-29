import path from "path";
import User from "../../models/userModel";
import Video from "../../models/videoModel";
import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler } from "express";

export const uploadFile: RequestHandler = async (req, res) => {
  try {
    if (req.file) {
      const { title, description } = req.body;
      let baseName;
      if (!title) {
        const extension = path.extname(req.file.originalname);
        baseName = path.basename(req.file.originalname, extension);
      }
      if (req.user instanceof User) {
        if ("location" in req.file) {
          const newVideo = await Video.create({
            title: title || baseName,
            description,
            uploadedBy: req.user._id,
            path: req.file.location,
          });
          return sendResponse(res, 200, true, "Video uploaded successfully", {
            video: {
              title: newVideo.title,
              description: newVideo.description,
              path: newVideo.path,
            },
          });
        }
        return sendResponse(res, 400, false, "File not uploaded successfully");
      }
      return sendResponse(
        res,
        400,
        false,
        "You are not allowed to upload video"
      );
    }
    return sendResponse(res, 400, false, "Please select a file");
  } catch (error) {
    console.error(`Error in uploading file: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};

export const fetch6LatestVideos: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = (page - 1) * limit;
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("uploadedBy", "email");
    sendResponse(res, 200, true, "Fetched latest videos sucessfully", {
      videos,
    });
  } catch (error) {
    console.error(`Errror in fetching videos from the database`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
