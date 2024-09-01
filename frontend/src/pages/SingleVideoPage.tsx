import backendApi from "../api/axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

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
      <div className="container p-7 mt-16">
        {video ? (
          <div>
            <div className="relative pb-[56.25%] h-0">
              {/* Aspect ratio 16:9 */}
              <ReactPlayer
                url={video.path}
                controls
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <p className="mt-2 text-lg">{video.description}</p>
            </div>
          </div>
        ) : (
          <div>No video found</div>
        )}
      </div>
    </Layout>
  );
};

export default SingleVideoPage;
