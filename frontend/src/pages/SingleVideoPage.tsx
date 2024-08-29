import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/v1/video/${videoId}`);
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
    <div className="min-h-screen bg-bgOne text-textOne flex flex-col items-center justify-center">
      <nav className="flex items-center bg-bgOne p-4 justify-center border-b-black border-b-[1px] fixed top-0 z-50 w-full text-5xl">
        <Link to={"/home"}>VideoShare</Link>
      </nav>

      <div className="container p-7 mt-16">
        {video ? (
          <div className="relative pb-[56.25%] h-0">
            {/* Aspect ratio 16:9 */}
            <ReactPlayer
              url={video.path}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
            />
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <p className="mt-2 text-lg">{video.description}</p>
            </div>
          </div>
        ) : (
          <div>No video found</div>
        )}
      </div>
    </div>
  );
};

export default SingleVideoPage;
