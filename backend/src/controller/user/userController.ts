import { AuthenticatedRequestHandler } from "../../config/passwordJwtStrategy";
import User from "../../models/userModel";
import Video from "../../models/videoModel";
import { sendResponse } from "../../utils/sendResponse";

export const updateUser: AuthenticatedRequestHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return sendResponse(res, 400, false, "Name is required");
    }
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 400, false, "Please sign in to continue");
      }
      const user = await User.findByIdAndUpdate(userId, { name });
      if (!user) {
        return sendResponse(res, 400, false, "User not updated");
      }
      sendResponse(res, 200, true, "Successfully updated your details", {
        name,
      });
    }
  } catch (error) {
    console.error(error);

    sendResponse(res, 500, false, "Internal server error");
  }
};

export const getLatestVideosForUser: AuthenticatedRequestHandler = async (
  req,
  res
) => {
  try {
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 400, false, "Please sign in to continue");
      }

      // pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 7;
      const skip = (page - 1) * limit;
      const videos = await Video.find({ uploadedBy: userId })
        .skip(skip)
        .limit(limit);

      // Get the total count of videos for pagination info
      const totalVideos = await Video.countDocuments({ uploadedBy: userId });

      sendResponse(res, 200, true, "Fetched videos successfully", {
        videos,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalVideos / limit),
          totalVideos,
        },
      });
    }
  } catch (error) {
    console.error(`Errror in getting videos ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
