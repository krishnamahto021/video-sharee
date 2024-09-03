import React, { useState } from "react";
import {
  FaLock,
  FaPen,
  FaTrash,
  FaUnlock,
  FaDownload,
  FaPlay,
} from "react-icons/fa";
import { FaExternalLinkAlt, FaShareAlt } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  downloadVideo,
  updateVideo,
  deleteVideo,
} from "../redux/reducers/video/videoReducer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  increaseDownloadCount,
  selectLoggedInUser,
} from "../redux/reducers/auth/authReducer";
import { useConfig } from "../customHooks/useConfigHook";
import { FaChalkboardUser } from "react-icons/fa6";

interface VideoCardProps {
  _id: string;
  title?: string;
  description?: string;
  path: string;
  uploadedBy: string;
  isPrivate: boolean;
  thumbnail: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  _id,
  title,
  description,
  path,
  uploadedBy,
  isPrivate,
  thumbnail,
}) => {
  const location = useLocation();
  const isMyVideosPage = location.pathname.includes("/user/edit/my-videos");
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector(selectLoggedInUser);
  const { configWithJWT } = useConfig();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState(title || "");
  const [updatedDescription, setUpdatedDescription] = useState(
    description || ""
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      if (loggedInUser?.token) {
        dispatch(increaseDownloadCount());
      }
      await dispatch(downloadVideo({ videoId: _id })).unwrap();
    } catch (error) {
      toast.error("Failed to download video");
    } finally {
      setIsLoading(false);
    }
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

  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
    if (!isPlaying) {
      setIsHovered(true);
    }
  };

  return (
    <div
      className="border border-gray-300 rounded-lg shadow-sm p-2 bg-white relative hover:shadow-md transition-shadow duration-300 ease-in-out m-2 w-full h-auto flex gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="leftContainer w-1/3 ">
        {/* Privacy Icon */}
        <div className="absolute z-10 top-2 left-2">
          {isPrivate ? (
            <FaLock size={16} className="text-red-500" />
          ) : (
            <FaUnlock size={16} className="text-green-500" />
          )}
        </div>

        {/* Share Icon */}
        <div
          className="absolute z-10 top-2 right-2 cursor-pointer"
          onClick={handleShare}
        >
          <FaShareAlt
            size={16}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          />
        </div>

        {/* Video Player */}
        <div
          className="rounded-lg overflow-hidden mb-2 relative"
          style={{ width: "100%", height: "180px" }}
        >
          <ReactPlayer
            url={path}
            light={thumbnail}
            width={"100%"}
            height={"100%"}
            controls={isPlaying}
            playing={isPlaying}
            onPause={() => handlePlayPause(false)}
            onPlay={() => handlePlayPause(true)}
          />
          {!isPlaying && isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-300">
              <FaPlay
                size={30}
                className="text-white cursor-pointer hover:text-gray-300 transition duration-200"
                onClick={() => handlePlayPause(true)}
              />
              {loading ? (
                <p className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200">
                  Downloading ....
                </p>
              ) : (
                <FaDownload
                  size={24}
                  className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200"
                  onClick={handleDownload}
                />
              )}
              <Link to={`/video/${_id}`}>
                <FaExternalLinkAlt
                  size={24}
                  className="text-white cursor-pointer absolute top-2 right-2 hover:text-gray-300 transition duration-200"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="rightContainer flex flex-col justify-between w-full">
        {/* Video Details */}
        <div className="flex flex-col mb-2 ">
          {isEditing ? (
            <>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-1 mb-1 text-gray-800"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                placeholder="Updated Title"
              />
              <textarea
                className="border border-gray-300 rounded-md p-1 mb-1 text-gray-800"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Updated Description"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 text-xs mb-1">{description}</p>
            </>
          )}
          <div className="flex items-center text-gray-500 text-xs">
            <FaChalkboardUser className="mr-1" />
            <span>{uploadedBy}</span>
          </div>
        </div>
        {/* Actions */}
        {/* Actions */}
        <div className="flex gap-1 justify-end">
          {isMyVideosPage && loggedInUser?.email === uploadedBy && (
            <>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="bg-green-500 text-white rounded-md p-2 text-sm hover:bg-green-600 transition duration-200"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white rounded-md p-2 text-sm hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-yellow-500 text-white rounded-md p-2 text-sm hover:bg-yellow-600 transition duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  <FaPen className="inline-block mr-1" /> Update
                </button>
              )}
              <Link
                to={`/video/${_id}`}
                className="border border-blue-500 text-blue-500 rounded-md p-2 text-sm hover:bg-blue-500 hover:text-white transition duration-200"
              >
                <FaExternalLinkAlt className="inline-block mr-1" /> Preview
              </Link>
              <button
                type="button"
                className="bg-red-500 text-white rounded-md p-2 text-sm hover:bg-red-600 transition duration-200"
                onClick={handleDelete}
              >
                <FaTrash className="inline-block mr-1" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
