import React from "react";
import { FaChalkboardUser, FaLock, FaUnlock } from "react-icons/fa6";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { downloadVideo } from "../redux/reducers/video/videoReducer";
import { Link } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
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
  isPrivate, // Add this prop
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
    <div className="border border-black rounded-sm p-2 relative">
      {/* Privacy Icon */}
      <div className="absolute z-10 top-2 left-2">
        {isPrivate ? (
          <FaLock size={20} className="text-red-600" />
        ) : (
          <FaUnlock size={20} className="text-green-600" />
        )}
      </div>

      <div
        className="absolute z-10 top-2 right-2 cursor-pointer"
        onClick={handleShare}
      >
        <FaShareAlt size={20} className="text-green-700" />
      </div>

      <ReactPlayer url={path} width={"100%"} controls />

      <div className="flex flex-col">
        <p className="text-lg">{title}</p>
        <p className="text-gray-800 text-sm">{description}</p>
        <div className="flex items-center w-fit text-gray-400 text-sm gap-4 justify-center mt-1">
          <FaChalkboardUser />
          <p>{uploadedBy}</p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <button
          type="button"
          className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-full"
          onClick={handleDownload}
        >
          Download
        </button>
        <Link
          to={`/video/${_id}`}
          className="rounded-md p-2 text-textOne border-2 border-[#10162f] text-lg w-full my-1 capitalize text-center"
        >
          See Video page
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;
