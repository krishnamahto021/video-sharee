import React from "react";
import { FaChalkboardUser, FaLock, FaUnlock } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";

import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { downloadVideo } from "../redux/reducers/video/videoReducer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  increaseDownloadCount,
  selectLoggedInUser,
} from "../redux/reducers/auth/authReducer";

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
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
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
      </div>
    </div>
  );
};

export default VideoCard;
