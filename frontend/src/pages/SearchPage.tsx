import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import VideoCard from "../components/VideoCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  getSearchResults,
  selectSearchVideos,
  selectVideoLoading,
} from "../redux/reducers/video/videoReducer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const searchResults = useSelector(selectSearchVideos);
  const isLoading = useSelector(selectVideoLoading);

  useEffect(() => {
    if (query) {
      dispatch(getSearchResults(query));
    }
  }, [query, dispatch]);

  return (
    <Layout>
      <div className="mt-3 px-3 w-full">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-bgOne"
          type="search"
          placeholder="What are you looking for ??"
        />
      </div>

      <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl my-7">
        Search Results
      </h1>
      <div className="w-fit grid grid-cols-1 gap-2 sm:grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? 
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={200} width={150} />
                <Skeleton height={30} width={150} className="mt-2" />
              </div>
            ))
          : searchResults?.map((video, index) => (
              <VideoCard
                key={index}
                _id={video._id}
                title={video.title}
                description={video.description}
                path={video.path}
                uploadedBy={video.uploadedBy.email}
                isPrivate={video.isPrivate}
              />
            ))}
      </div>
    </Layout>
  );
};

export default SearchPage;
