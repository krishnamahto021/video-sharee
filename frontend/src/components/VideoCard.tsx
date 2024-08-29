import React from "react";
import { FaChalkboardUser } from "react-icons/fa6";
import ReactPlayer from "react-player";

interface VideoCardProps {
  title?: string;
  description?: string;
  path: string;
  uploadedBy: string;
}
const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  path,
  uploadedBy,
}) => {
  return (
    <>
      <div className="border border-black rounded-sm  p-2 ">
        <ReactPlayer url={path} light width={""} />
        <div className="flex flex-col">
          <p className="text-lg">{title}</p>
          <p className="text-gray-800 text-sm">{description}</p>
          <div className="flex items-center w-fit text-gray-400 text-sm gap-4 justify-center mt-1">
            <FaChalkboardUser />
            <p>{uploadedBy}</p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-bgFour  rounded-md p-2 text-white text-lg  mt-5 hover:bg-opacity-90 duration-300 capitalize  w-full"
        >
          Download
        </button>
      </div>
    </>
  );
};

export default VideoCard;
