import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForUser,
  selectVideos,
} from "../../redux/reducers/video/videoReducer";
import VideoCard from "../../components/VideoCard";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import { useConfig } from "../../customHooks/useConfigHook";
import { AppDispatch } from "../../redux/store";

const MyVideos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector(selectVideos);
  const { configWithJWT } = useConfig();

  useEffect(() => {
    // Fetch the user's uploaded videos when the component mounts
    dispatch(fetchVideoForUser({ configWithJwt: configWithJWT }));
  }, [dispatch, configWithJWT]);

  return (
    <Layout>
      <div className="flex w-full gap-2 pr-2">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 ml-0 md:ml-64">
          <section className="p-4 mt-7">
            <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl mb-7">
              My Uploaded Videos
            </h1>
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-3">
              {videos?.map((video, index) => (
                <VideoCard
                  _id={video._id}
                  key={index}
                  title={video.title}
                  description={video.description}
                  path={video.path}
                  uploadedBy={video.uploadedBy.email}
                  isPrivate={video.isPrivate}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default MyVideos;
