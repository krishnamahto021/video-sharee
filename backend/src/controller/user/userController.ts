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

export const getLatestVideos: AuthenticatedRequestHandler = async (
  req,
  res
) => {
  try {
    if (req.user instanceof User) {
      const userId = req.user._id;
      if (!userId) {
        return sendResponse(res, 400, false, "Please sign in to continue");
      }
      const videos = await Video.find({ uploadedBy: userId });
      sendResponse(res, 200, true, "Fetched videos successfully", { videos });
    }
  } catch (error) {
    console.error(`Errror in getting videos ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
