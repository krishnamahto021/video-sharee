import React, { useEffect } from "react";
import Layout from "../components/Layout";
import VideoCard from "../components/VideoCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForPublic,
  selectVideos,
} from "../redux/reducers/video/videoReducer";
import { AppDispatch } from "../redux/store";

const Home: React.FC = () => {
  const publicVideos = useSelector(selectVideos);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchVideoForPublic());
  }, [dispatch]);
  return (
    <Layout>
      <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl  my-7">
        Explore here
      </h1>
      <div className="w-fit grid grid-cols-1 gap-2 sm:grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4">
        {publicVideos?.map((video, index) => (
          <VideoCard
            key={index}
            _id={video._id}
            title={video.title}
            description={video.description}
            path={video.path}
            uploadedBy={video.uploadedBy.email}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
