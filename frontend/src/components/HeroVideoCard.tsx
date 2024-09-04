import React, { useState } from "react";
import ReactPlayer from "react-player";
import { downloadVideo, IVideo } from "../redux/reducers/video/videoReducer";
import { FaDownload, FaPlay, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  increaseDownloadCount,
  selectLoggedInUser,
} from "../redux/reducers/auth/authReducer";
import { toast } from "sonner";

interface HeroVideoCardProps {
  video: IVideo;
}

const HeroVideoCard: React.FC<HeroVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch<AppDispatch>();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsHovered(true); 
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      if (loggedInUser?.token) {
        dispatch(increaseDownloadCount());
      }
      await dispatch(downloadVideo({ videoId: video._id })).unwrap();
    } catch (error) {
      toast.error("Failed to download video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const videoLink = `https://video-sharee-flame.vercel.app/video/${video._id}`;
    navigator.clipboard.writeText(videoLink).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <div
      className="heroVideoCard flex flex-col gap-2 p-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rounded-lg overflow-hidden mb-2 relative"
        style={{ width: "100%", height: "180px", cursor: "pointer" }}
      >
        <ReactPlayer
          url={video.path}
          light={video.thumbNail}
          width={"100%"}
          height={"100%"}
          controls={isPlaying} // Only show controls when playing
          playing={isPlaying}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
        {!isPlaying && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-300">
            <FaPlay
              size={30}
              className="text-white cursor-pointer hover:text-gray-300 transition duration-200"
              onClick={handlePlayPause}
            />
            {isLoading ? (
              <p className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200">
                Downloading ....
              </p>
            ) : (
              <FaDownload
                size={20}
                className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200"
                onClick={handleDownload}
              />
            )}
            <Link to={`/video/${video._id}`}>
              <FaExternalLinkAlt
                size={20}
                className="text-white cursor-pointer absolute top-2 right-2 hover:text-gray-300 transition duration-200"
              />
            </Link>
            <div
              className="absolute z-10 top-2 left-2 cursor-pointer"
              onClick={handleShare}
            >
              <FaShareAlt
                size={20}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              />
            </div>
          </div>
        )}
      </div>
      <div className="detailsContainer mt-2">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <div className="userContainer flex text-gray-400 items-center">
          <img
            className="w-4 h-4 rounded-full mr-2"
            src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
            alt="User Icon"
          />
          <p className="text-sm">{video.uploadedBy.email}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoCard;
