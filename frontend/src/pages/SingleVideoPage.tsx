import backendApi from "../api/axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import parse from "html-react-parser";
import { FaPlay, FaDownload } from "react-icons/fa6";
import Loader from "../components/Laoder";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { downloadVideo } from "../redux/reducers/video/videoReducer";
import { toast } from "sonner";

interface Video {
  _id: string;
  title: string;
  description: string;
  path: string;
  key: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

const SingleVideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await backendApi.get(`/api/v1/video/${videoId}`);
        if (response.data.success) {
          setVideo(response.data.video);
        } else {
          setError(response.data.message);
        }
      } catch (error: any) {
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (videoId) {
        await dispatch(downloadVideo({ videoId })).unwrap();
        toast.success("Video downloaded");
      }
    } catch (error) {
      toast.error("Failed to download video");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div className="relative w-full h-[69vh]">
        {/* Video Overlay */}
        {video && !isPlaying && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black flex flex-col justify-center items-start p-8"
            style={{ zIndex: 5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              {video.title}
            </h1>
            {video?.description ? (
              <p className="text-gray-400">
                {parse(video?.description.substring(0, 100))}
              </p>
            ) : (
              <p>default</p>
            )}
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white w-16 h-16 rounded-full flex justify-center items-center
                transition duration-300 animate-scale-pulse ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform"
                onClick={() => setIsPlaying(true)}
              >
                <FaPlay className="text-4xl" />
              </button>

              {/* Download Button */}
              <button
                className={`bg-green-500 text-white w-16 h-16 rounded-full flex justify-center items-center transition duration-300 ease-in-out transform ${
                  isDownloading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-green-700 hover:shadow-lg hover:scale-105"
                }`}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  <FaDownload className="text-4xl" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Video Player */}
        {video && (
          <div
            className={`relative w-full h-full ${
              isPlaying ? "flex justify-center items-center" : "pt-1/2"
            }`}
            style={{ zIndex: isPlaying ? 0 : 1 }}
          >
            <ReactPlayer
              url={video.path}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              playing={isPlaying}
            />

            {/* New Download Button (Top Right) */}
            {isPlaying && (
              <button
                className={`absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full flex justify-center items-center transition duration-300 ease-in-out transform z-10 ${
                  isDownloading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-green-700 hover:shadow-lg hover:scale-105"
                }`}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    ></path>
                  </svg>
                ) : (
                  <FaDownload className="text-xl" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SingleVideoPage;
