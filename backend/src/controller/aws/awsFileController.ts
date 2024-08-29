import path from "path";
import User from "../../models/userModel";
import Video from "../../models/videoModel";
import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler } from "express";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
          if ("key" in req.file) {
            const newVideo = await Video.create({
              title: title || baseName,
              description,
              uploadedBy: req.user._id,
              path: req.file.location,
              key: req.file.key,
            });
            return sendResponse(res, 200, true, "Video uploaded successfully", {
              video: {
                title: newVideo.title,
                description: newVideo.description,
                path: newVideo.path,
              },
            });
          }
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

// download video by generating presigned url
export const downloadVideo: RequestHandler = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return sendResponse(res, 400, false, "video not found");
    }
    // Construct the filename
    const extension = video.path.split(".").pop();
    const filename = video.title
      ? `${video.title}.${extension}`
      : `video.${extension}`;

    // Set Content-Disposition header to suggest the filename
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    // generate a presigned url
    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: video.key,
    };

    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("Error in streaming file:", err);
      sendResponse(res, 500, false, "Failed to download video");
    });
  } catch (error) {
    console.error(`Error in generating download URL: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
