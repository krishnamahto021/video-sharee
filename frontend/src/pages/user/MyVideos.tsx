import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForUser,
  selectVideos,
} from "../../redux/reducers/video/videoReducer";
import VideoCard from "../../components/VideoCard";
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
    <div className="flex w-full gap-2 ">
      <Sidebar />
      <main className="flex-1  lg:ml-64">
        <section className="p-4 mt-3">
          <div className="grid gap-2 grid-cols-1 ">
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
        </section>
      </main>
    </div>
  );
};

export default MyVideos;
