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
import VideoSlider from "../components/VideoSlider";

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
      <div className="w-full p-4">
        <main className="w-[95vw]">
          <div className="">
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
              <>
                {/* Section 1: Displaying the same public videos */}
                <div className="p-4">
                  <h2 className="capitalize text-textTwo  text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
                    Most Liked
                  </h2>
                  <VideoSlider videos={publicVideos} />
                </div>

                {/* Section 2: Displaying the same public videos */}
                <div className="p-4">
                  <h2 className="capitalize text-textTwo  text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
                    Trending Now
                  </h2>
                  <VideoSlider videos={publicVideos} />
                </div>

                {/* Section 3: Displaying the same public videos */}
                <div className="p-4">
                  <h2 className="capitalize text-textTwo  text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
                    Recently Added
                  </h2>
                  <VideoSlider videos={publicVideos} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AllVideos;
