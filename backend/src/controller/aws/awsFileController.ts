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
    if (req.files && (req.files as any).video) {
      let { title, description, isPrivate } = req.body;

      let baseName;
      const videoFile = (req.files as any).video[0];
      const thumbnailFile = (req.files as any).thumbnail
        ? (req.files as any).thumbnail[0]
        : null;

      if (!title) {
        const extension = path.extname(videoFile.originalname);
        baseName = path.basename(videoFile.originalname, extension);
      }

      if (req.user instanceof User) {
        if ("location" in videoFile) {
          if ("key" in videoFile) {
            const newVideo = await Video.create({
              title: title || baseName,
              description: description ? description : undefined,
              uploadedBy: req.user._id,
              path: videoFile.location,
              key: videoFile.key,
              isPrivate,
              thumbNail: thumbnailFile ? thumbnailFile.location : undefined,
            });
            const user = await User.findById(req.user._id);
            if (user) {
              user.uploadCount += 1;
              await user.save();
            }
            return sendResponse(res, 200, true, "Video uploaded successfully", {
              video: {
                _id: newVideo._id,
                path: newVideo.path,
                title: newVideo.title,
                description: newVideo.description,
                thumbNail: newVideo.thumbNail, // Return the thumbnail URL
                uploadedBy: {
                  email: user?.email,
                },
                isPrivate: newVideo.isPrivate,
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
    const videos = await Video.find({ isPrivate: false })
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

    // checks if there is user and if yes update the user download count by 1
    const { userId } = req.query;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.downloadCount += 1;
        await user.save();
      }
    }
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

// get single video based on the id
export const getVideo: RequestHandler = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return sendResponse(res, 400, false, "Not a valid video");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return sendResponse(res, 400, false, "Video not found");
    }
    sendResponse(res, 200, true, "Video found", { video });
  } catch (error) {
    console.error(`Error in generating download URL: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};

// update videos
export const updateVideo: RequestHandler = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return sendResponse(res, 400, false, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("uploadedBy", "email");
    if (!video) {
      return sendResponse(res, 404, false, "Video not found");
    }

    // Update title, description, etc.
    Object.assign(video, req.body);

    // Check if a new video file is uploaded
    if (req.files && (req.files as any).video) {
      const videoFile = (req.files as any).video[0];
      if ("location" in videoFile && "key" in videoFile) {
        // Update video path and key
        video.path = videoFile.location;
        video.key = videoFile.key;
      }
    }

    // Check if a new thumbnail file is uploaded
    if (req.files && (req.files as any).thumbnail) {
      const thumbnailFile = (req.files as any).thumbnail[0];

      if ("location" in thumbnailFile && "key" in thumbnailFile) {
        // Update thumbnail path
        video.thumbNail = thumbnailFile.location;
      }
    }

    // Save the updated video document
    await video.save();
    sendResponse(res, 200, true, "Video updated successfully", { video });
  } catch (error) {
    console.error(`Error in updating video: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};

// delete video
export const deleteVideo: RequestHandler = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return sendResponse(res, 400, false, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return sendResponse(res, 404, false, "Video not found");
    }

    await Video.findByIdAndDelete(videoId);

    sendResponse(res, 200, true, "Video deleted successfully");
  } catch (error) {
    console.error(`Error in deleting video: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
