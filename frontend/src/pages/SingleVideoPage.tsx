import backendApi from "../api/axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import parse from "html-react-parser";
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
      <div className="relative w-full  mt-3">
        {/* Video Player */}
        {video && !isPlaying && (
          <div
            className="absolute top-0 left-0 w-[100%]  h-full bg-gradient-to-r from-black flex flex-col justify-center items-start p-8 "
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
              className="bg-white w-1/3 md:w-1/4 lg:w-1/5 text-black px-4 py-2 rounded mt-4 
             transition duration-300 ease-in-out 
             hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 
             hover:text-white hover:shadow-lg hover:scale-105 transform"
              onClick={() => setIsPlaying(true)}
            >
              Play
            </button>
          </div>
        )}

        {/* Video Player */}
        {video && (
          <div
            className={`relative pb-[56.25%] h-0 ${
              isPlaying ? "absolute top-0 left-0 w-full h-full" : "pt-1/2"
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
