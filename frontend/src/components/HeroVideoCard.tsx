import React, { useEffect, useRef, useState } from "react";
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
import parse from "html-react-parser";
import { MdAccessTime } from "react-icons/md";

interface HeroVideoCardProps {
  video: IVideo;
}

const HeroVideoCard: React.FC<HeroVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0); // State to store video duration
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch<AppDispatch>();

  // Reference for hidden video element
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Preload video metadata to get the duration before playing
    if (video.path) {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.onloadedmetadata = () => {
          setDuration(videoElement.duration); // Set duration once metadata is loaded
        };
      }
    }
  }, [video.path]);

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

  // Helper function to format the duration to mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="heroVideoCard flex flex-col gap-2  relative bg-white rounded-md m-2 h-52"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden video element to preload metadata */}
      <video
        ref={videoRef}
        src={video.path}
        style={{ display: "none" }}
        preload="metadata"
      />

      <div
        className="overflow-hidden mb-2 relative"
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
      <div className="detailsContainer px-2">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <div className="userContainer flex justify-between items-center">
          <div className="text-gray-600 text-xs mb-1">
            {video?.description ? (
              <p>{parse(video?.description.substring(0, 100))}</p>
            ) : (
              <p>default</p>
            )}
          </div>
          {duration > 0 && (
            <div className="text-gray-500 text-xs flex items-center gap-2 pb-2">
              <MdAccessTime className="text-lg" />
              <p>{formatDuration(duration)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroVideoCard;
