import React, { useState } from "react";
import {
  FaChalkboardUser,
  FaLock,
  FaPen,
  FaTrash,
  FaUnlock,
} from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";

import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  downloadVideo,
  updateVideo,
  deleteVideo,
} from "../redux/reducers/video/videoReducer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  increaseDownloadCount,
  selectLoggedInUser,
} from "../redux/reducers/auth/authReducer";
import { useConfig } from "../customHooks/useConfigHook";

interface VideoCardProps {
  _id: string;
  title?: string;
  description?: string;
  path: string;
  uploadedBy: string;
  isPrivate: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  _id,
  title,
  description,
  path,
  uploadedBy,
  isPrivate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector(selectLoggedInUser);
  const { configWithJWT } = useConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title || "");
  const [updatedDescription, setUpdatedDescription] = useState(
    description || ""
  );

  const handleDownload = () => {
    if (loggedInUser?.token) {
      dispatch(increaseDownloadCount());
    }
    dispatch(downloadVideo({ videoId: _id }));
  };

  const handleShare = () => {
    const videoLink = `https://video-sharee-flame.vercel.app/video/${_id}`;
    navigator.clipboard.writeText(videoLink).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleUpdate = async () => {
    if (!updatedTitle || !updatedDescription) {
      toast.error("Title and description cannot be empty.");
      return;
    }

    const updateData = {
      title: updatedTitle,
      description: updatedDescription,
    };
    try {
      await dispatch(
        updateVideo({
          videoId: _id,
          updateData,
          configWithJwt: configWithJWT,
        })
      ).unwrap();
      toast.success("Video updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update video: " + error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteVideo({
          videoId: _id,
          configWithJwt: configWithJWT,
        })
      ).unwrap();
      toast.success("Video deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete video: " + error);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white relative hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {/* Privacy Icon */}
      <div className="absolute z-10 top-4 left-4">
        {isPrivate ? (
          <FaLock size={20} className="text-red-500" />
        ) : (
          <FaUnlock size={20} className="text-green-500" />
        )}
      </div>

      {/* Share Icon */}
      <div
        className="absolute z-10 top-4 right-4 cursor-pointer"
        onClick={handleShare}
      >
        <FaShareAlt
          size={20}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
        />
      </div>

      {/* Video Player */}
      <div className="rounded-lg overflow-hidden mb-4">
        <ReactPlayer url={path} width={"100%"} controls />
      </div>

      {/* Video Details */}
      <div className="flex flex-col mb-4">
        {isEditing ? (
          <>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-2 text-gray-800"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              placeholder="Updated Title"
            />
            <textarea
              className="border border-gray-300 rounded-md p-2 mb-2 text-gray-800"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              placeholder="Updated Description"
            />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
          </>
        )}
        <div className="flex items-center text-gray-500 text-sm">
          <FaChalkboardUser className="mr-2" />
          <span>{uploadedBy}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2">
        <button
          type="button"
          className="bg-blue-500 text-white rounded-md p-3 text-lg hover:bg-blue-600 transition duration-200"
          onClick={handleDownload}
        >
          Download
        </button>
        <Link
          to={`/video/${_id}`}
          className="border border-blue-500 text-blue-500 rounded-md p-3 text-lg text-center hover:bg-blue-500 hover:text-white transition duration-200"
        >
          See Video Page
        </Link>

        {loggedInUser?.email === uploadedBy && (
          <>
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="bg-green-500 text-white rounded-md p-3 text-lg hover:bg-green-600 transition duration-200"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white rounded-md p-3 text-lg hover:bg-gray-600 transition duration-200"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-yellow-500 text-white rounded-md p-3 text-lg hover:bg-yellow-600 transition duration-200"
                onClick={() => setIsEditing(true)}
              >
                <FaPen className="inline-block mr-2" /> Update
              </button>
            )}
            <button
              type="button"
              className="bg-red-500 text-white rounded-md p-3 text-lg hover:bg-red-600 transition duration-200"
              onClick={handleDelete}
            >
              <FaTrash className="inline-block mr-2" /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
