import React, { useEffect } from "react";
import Layout from "../components/Layout";
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
import HeroVideoCard from "../components/HeroVideoCard";

const AllVideos: React.FC = () => {
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
        <main className="flex-1 ">
          <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl my-7">
            Explore here
          </h1>
          <div className="w">
            {isLoading ? (
              // Display skeleton loaders when data is loading
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4">
                  <Skeleton height={200} width={150} />
                  <Skeleton height={30} width={150} className="mt-2" />
                </div>
              ))
            ) : error ? (
              // Display error message if there is an error
              <p className="text-red-500 text-center">Error: {error}</p>
            ) : publicVideos?.length === 0 ? (
              <p className="text-center">No videos available</p>
            ) : (
              publicVideos?.map((video, index) => (
                <HeroVideoCard key={index} video={video} />
              ))
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AllVideos;
