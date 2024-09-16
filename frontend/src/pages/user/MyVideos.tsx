import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForUser,
  selectVideos,
  selectVideoLoading,
  selectVideoError,
} from "../../redux/reducers/video/videoReducer";
import VideoCard from "../../components/VideoCard";
import Sidebar from "../../components/Sidebar";
import { useConfig } from "../../customHooks/useConfigHook";
import { AppDispatch } from "../../redux/store";
import "react-loading-skeleton/dist/skeleton.css";
import Loader from "../../components/Laoder";

const MyVideos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector(selectVideos);
  const isLoading = useSelector(selectVideoLoading);
  const error = useSelector(selectVideoError);
  const { configWithJWT } = useConfig();

  useEffect(() => {
    dispatch(fetchVideoForUser({ configWithJwt: configWithJWT }));
  }, []);

  return (
    <div className="flex w-full gap-2 ">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <section className="p-4 mt-3">
          {isLoading ? (
            // Display skeleton loaders when data is loading
            <Loader />
          ) : error ? (
            // Display error message if there is an error
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : videos?.length === 0 ? (
            <p className="text-center">No videos available</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
              {videos?.map((video, index) => (
                <VideoCard
                  _id={video._id}
                  key={index}
                  title={video.title}
                  description={video.description}
                  path={video.path}
                  uploadedBy={video.uploadedBy.email}
                  isPrivate={video.isPrivate}
                  thumbnail={video.thumbNail}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyVideos;
