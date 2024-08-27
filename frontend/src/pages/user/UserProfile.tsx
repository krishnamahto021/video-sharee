import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  logOutUser,
  selectLoggedInUser,
} from "../../redux/reducers/auth/authReducer";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectLoggedInUser);
  const [name, setName] = useState<string>("");
  return (
    <Layout>
      <section className="p-2 mt-7 sm:w-1/2">
        <h1 className="text-center font-semibold text-lg">Personal Details</h1>
        <div className="container flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              value={loggedInUser?.name || name}
              className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-transparent "
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              value={loggedInUser?.email || "email"}
              className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] cursor-not-allowed"
              disabled
            ></input>
          </div>
        </div>
        <h1 className="text-center font-semibold text-lg mt-7">Videos</h1>
        <div className="flex flex-col">
          <div>Uploaded videos : 15</div>
          <div>Downloaded videos : 16</div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-bgFour   rounded-md p-2 text-white text-lg  mt-5 hover:bg-opacity-90 duration-300 capitalize md:w-1/3"
            onClick={() => dispatch(logOutUser(navigate))}
          >
            Log out
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default UserProfile;
