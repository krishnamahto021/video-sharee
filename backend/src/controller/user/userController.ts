import { AuthenticatedRequestHandler } from "../../config/passwordJwtStrategy";
import User from "../../models/userModel";
import Video from "../../models/videoModel";
import { sendResponse } from "../../utils/sendResponse";

export const getUserDetails: AuthenticatedRequestHandler = async (req, res) => {
  try {
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 400, false, "Please sign in to continue");
      }

      // Find the user by their ID, exclude the password field
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      sendResponse(res, 200, true, "User details fetched successfully", {
        user,
      });
    }
  } catch (error) {
    console.error(`Error in getting user details: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};

export const updateUser: AuthenticatedRequestHandler = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name) {
      return sendResponse(res, 400, false, "Name is required");
    }
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 400, false, "Please sign in to continue");
      }
      console.log(email);

      const user = await User.findByIdAndUpdate(userId, { name, email });
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("uploadedBy", "email");

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
