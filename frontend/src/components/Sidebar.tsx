import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUpload,
  FaVideo,
  FaCog,
  FaQuestionCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed  left-4 z-50 text-textOne text-3xl md:hidden"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-bgOne text-textOne shadow-lg transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 text-2xl font-semibold border-b border-gray-300">
          Video Share
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/user/dashboard"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaHome className="mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/upload-video"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaUpload className="mr-3" />
                <span>Upload Video</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/videos"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaVideo className="mr-3" />
                <span>My Videos</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/profile"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaCog className="mr-3" />
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/help"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaQuestionCircle className="mr-3" />
                <span>Help</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
