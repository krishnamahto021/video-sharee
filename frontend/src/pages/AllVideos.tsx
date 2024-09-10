import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForPublic,
  getSearchResults,
  selectPublicVideos,
  selectSearchVideos,
  selectVideoLoading,
} from "../redux/reducers/video/videoReducer";
import { AppDispatch } from "../redux/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HeroVideoCard from "../components/HeroVideoCard";

const AllVideos: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const dispatch = useDispatch<AppDispatch>();
  const publicVideos = useSelector(selectPublicVideos);
  const searchResults = useSelector(selectSearchVideos);
  const isLoading = useSelector(selectVideoLoading);

  useEffect(() => {
    if (searchTerm) {
      dispatch(getSearchResults(searchTerm));
    } else {
      dispatch(fetchVideoForPublic());
    }
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchTerm(query); // Trigger search when the button is clicked
  };

  return (
    <Layout>
      <div className="w-full p-4">
        <main className="w-[95vw]">
          {/* Search Bar */}
          <div className="mt-3 px-3 w-full flex justify-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-8/12 block rounded-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-bgOne"
              type="search"
              placeholder="What are you looking for?"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              Search
            </button>
          </div>

          {/* Videos Grid */}
          <div className="mt-6">
            {searchTerm ? (
              searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-4">
                  {searchResults.map((video, index) => (
                    <HeroVideoCard key={index} video={video} />
                  ))}
                </div>
              ) : (
                <p className="text-center">No videos found</p>
              )
            ) : isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <Skeleton
                    key={index}
                    height={300}
                    width={200}
                    className="rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2 lg:grid-cols-4">
                {publicVideos?.map((video, index) => (
                  <HeroVideoCard key={index} video={video} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AllVideos;
