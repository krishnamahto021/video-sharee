// src/pages/Home.tsx
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import VideoSlider from "../components/VideoSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForPublic,
  selectPublicVideos,
  selectVideoLoading,
  selectVideoError,
} from "../redux/reducers/video/videoReducer";
import { AppDispatch } from "../redux/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "../components/Sidebar";

const Home: React.FC = () => {
  const publicVideos = useSelector(selectPublicVideos);
  const isLoading = useSelector(selectVideoLoading);
  const error = useSelector(selectVideoError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchVideoForPublic());
  }, [dispatch]);

  return (
    <Layout>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 w-[95vw]">
          <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl my-7">
            Recently added
          </h1>
          {isLoading ? (
            // Display skeleton loaders when data is loading
            <div className="w-full flex justify-center">
              <Skeleton height={300} width={800} />
            </div>
          ) : error ? (
            // Display error message if there is an error
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : publicVideos?.length === 0 ? (
            <p className="text-center">No videos available</p>
          ) : (
            <div className="lg:ml-64">
              <VideoSlider videos={publicVideos} />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
