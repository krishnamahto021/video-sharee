import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bgOne flex flex-col">
      <nav className="flex items-center bg-bgOne p-4 justify-between md:text-lg border-b-black border-b-[1px] fixed top-0 z-50 w-full">
        <div>
          <Link to={"/home"}>VideoShare</Link>
        </div>
        <div className="flex items-center gap-3 md:gap-5 lg:gap-7 capitalize">
          <Link to={"/search-video"}>
            <FaSearch />
          </Link>
          <Link to={"/user/upload-video"}>upload</Link>
          <Link to={"/user/profile"}>
            <FaUser className="" />
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center w-full mt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
