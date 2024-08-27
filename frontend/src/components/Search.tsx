import React from "react";

const Search: React.FC = () => {
  return (
    <input
      className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-bgOne"
      type="search"
      placeholder="What are you looking for ?? "
    ></input>
  );
};

export default Search;
