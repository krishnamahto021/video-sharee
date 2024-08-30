import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
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
          <NavLink to={"/home"}>VideoShare</NavLink>
        </div>
        <div className="flex items-center gap-3 md:gap-5 lg:gap-7 capitalize">
          <NavLink to={"/search-video"}>
            <FaSearch />
          </NavLink>
          <NavLink to={"/user/upload-video"}>upload</NavLink>
          <NavLink to={"/user/profile"}>
            <FaUser className="" />
          </NavLink>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center w-full mt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
