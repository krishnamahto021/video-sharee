import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="w-full">
      <ReactPlayer url={url} controls className="react-player" width={""} />
    </div>
  );
};

export default VideoPlayer;
