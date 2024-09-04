import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForPublic,
  getSearchResults,
  selectPublicVideos,
  selectSearchVideos,
  selectVideoLoading,
  selectVideoError,
} from "../redux/reducers/video/videoReducer";
import { AppDispatch } from "../redux/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import VideoSlider from "../components/VideoSlider";
import VideoCard from "../components/VideoCard";

const AllVideos: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const publicVideos = useSelector(selectPublicVideos);
  const searchResults = useSelector(selectSearchVideos);
  const isLoading = useSelector(selectVideoLoading);
  const error = useSelector(selectVideoError);

  useEffect(() => {
    if (query) {
      dispatch(getSearchResults(query));
    } else {
      dispatch(fetchVideoForPublic());
    }
  }, [query]);

  return (
    <Layout>
      <div className="w-full p-4">
        <main className="w-[95vw]">
          {/* Search Bar */}
          <div className="mt-3 px-3 w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-bgOne"
              type="search"
              placeholder="What are you looking for?"
            />
          </div>

          {/* Main Content */}
          <div className="mt-6">
            {isLoading ? (
              // Display skeleton loaders when data is loading
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} height={200} width={150} />
                ))}
              </div>
            ) : error ? (
              // Display error message if there is an error
              <p className="text-red-500 text-center">Error: {error}</p>
            ) : query ? (
              // Display search results if a query is present
              <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4">
                {searchResults ? (
                  searchResults.map((video, index) => (
                    <VideoCard
                      key={index}
                      _id={video._id}
                      title={video.title}
                      description={video.description}
                      path={video.path}
                      uploadedBy={video.uploadedBy.email}
                      isPrivate={video.isPrivate}
                      thumbnail={video.thumbNail}
                    />
                  ))
                ) : (
                  <p className="text-center">No videos found</p>
                )}
              </div>
            ) : (
              // Display default sections if no query is present
              <>
                <div className="p-4">
                  <h2 className="capitalize text-textTwo text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
                    Most Liked
                  </h2>
                  <VideoSlider videos={publicVideos} />
                </div>

                <div className="p-4">
                  <h2 className="capitalize text-textTwo text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
                    Trending Now
                  </h2>
                  <VideoSlider videos={publicVideos} />
                </div>

                <div className="p-4">
                  <h2 className="capitalize text-textTwo text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6">
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
