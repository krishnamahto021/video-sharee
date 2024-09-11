import backendApi from "../api/axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import parse from "html-react-parser";
import { FaPlay } from "react-icons/fa6";

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

  if (loading) return <div>Loading...</div>;
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
            <button
              className="bg-blue-500 text-white w-16 h-16 rounded-full flex justify-center items-center mt-4
              transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform"
              onClick={() => setIsPlaying(true)}
            >
              <FaPlay className="text-4xl" />
            </button>
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SingleVideoPage;
