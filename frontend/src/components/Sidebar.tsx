import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUpload,
  FaVideo,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  fetchUserDetails,
  logOutUser,
} from "../redux/reducers/auth/authReducer";
import { AppDispatch } from "../redux/store";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, []);

  return (
    <div className="fixed top-0 z-50">
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed  left-4 z-50 text-textOne text-3xl lg:hidden"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-bgOne text-textOne shadow-lg transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4 text-2xl font-semibold border-b border-gray-300">
          Video Share
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaHome size={20} className="mr-3" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/dashboard"
                className="flex items-center p-3 hover:bg-bgTwo rounded-md"
                onClick={toggleSidebar}
              >
                <FaUser className="mr-3" />
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
                to="/user/edit/my-videos"
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
                <span>User profile</span>
              </NavLink>
            </li>
            <li>
              <div
                className="flex items-center p-3 hover:bg-bgTwo rounded-md cursor-pointer"
                onClick={() => dispatch(logOutUser(navigate))}
              >
                <IoIosLogOut size={20} className="mr-3" />
                <span>Log out</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
