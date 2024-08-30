import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  logOutUser,
  selectLoggedInUser,
  updateUser,
} from "../../redux/reducers/auth/authReducer";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import axios from "axios";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
interface AuthResponse {
  success: boolean;
  message: string;
  data?: object;
}

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectLoggedInUser);
  const { configWithJWT } = useConfig();

  const [name, setName] = useState<string>(loggedInUser?.name || "");
  const [edit, setEdit] = useState<boolean>(false);

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    try {
      const { data } = await axios.post<AuthResponse>(
        "/api/v1/user/update-profile",
        { name },
        configWithJWT
      );

      if (data.success) {
        if (data.data) {
          dispatch(updateUser(name));
        }
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }

    setEdit(false);
  };

  return (
    <Layout>
      <section className="p-2 mt-7 sm:w-1/2">
        <h1 className="text-center font-semibold text-lg">Personal Details</h1>
        <div className="container flex flex-col gap-2">
          <div className="flex items-center">
            <div className="flex flex-col w-full">
              <label htmlFor="name">Name</label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-transparent `}
                  disabled={!edit}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => (edit ? handleSaveClick() : handleEditClick())}
                >
                  {edit ? (
                    <FaSave className="text-green-600" />
                  ) : (
                    <FaPencilAlt />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              value={loggedInUser?.email || "email"}
              className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        <h1 className="text-center font-semibold text-lg mt-7">Videos</h1>
        <div className="flex flex-col">
          <div>
            Uploaded videos :
            <span className="text-gray-700 mx-2">
              {loggedInUser?.uploadCount}
            </span>
          </div>
          <div>
            Downloaded videos :{" "}
            <span className="text-gray-700 mx-2">
              {loggedInUser?.downloadCount}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize md:w-1/3"
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
