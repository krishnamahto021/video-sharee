import React, { useState } from "react";
import ReactPlayer from "react-player";
import { IVideo } from "../redux/reducers/video/videoReducer";

interface HeroVideoCardProps {
  video: IVideo;
}

const HeroVideoCard: React.FC<HeroVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause
  };

  return (
    <div className="heroVideoCard flex flex-col gap-2 p-2">
      <div
        className="rounded-lg overflow-hidden mb-2 relative"
        style={{ width: "100%", height: "180px", cursor: "pointer" }} // Added cursor style
        onClick={handlePlayPause} // Toggle play/pause on click
      >
        <ReactPlayer
          url={video.path}
          light={video.thumbNail}
          width={"100%"}
          height={"100%"}
          playing={isPlaying} // Control playback
        />
      </div>
      <div className="detailsContainer mt-2">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <div className="userContainer flex text-gray-400 items-center">
          <img
            className="w-4 h-4 rounded-full mr-2"
            src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
            alt="User Icon"
          />
          <p className="text-sm">{video.uploadedBy.email}</p>{" "}
          {/* Display uploader's email or name */}
        </div>
      </div>
    </div>
  );
};

export default HeroVideoCard;
