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
import backendApi from "../../api/axios";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";

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
      const { data } = await backendApi.post<AuthResponse>(
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
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 ml-0 md:ml-64">
          <section className="p-4 bg-white shadow-lg rounded-lg w-[70vw] md:w-[50vw]">
            <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">
              Personal Details
            </h1>
            <div className="container flex flex-col gap-4">
              <div className="flex items-center">
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className="font-medium text-gray-600">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full p-3 focus:outline-none border rounded-md ${
                        edit ? "border-blue-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                      disabled={!edit}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        edit ? handleSaveClick() : handleEditClick()
                      }
                    >
                      {edit ? (
                        <FaSave className="text-green-600 hover:text-green-800 duration-200" />
                      ) : (
                        <FaPencilAlt className="text-gray-600 hover:text-gray-800 duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={loggedInUser?.email || "email"}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            <div className="flex items-center justify-center mt-7">
              <button
                type="button"
                className="bg-red-500 rounded-md p-3 text-white text-lg hover:bg-red-600 duration-300 w-1/2"
                onClick={() => dispatch(logOutUser(navigate))}
              >
                Log out
              </button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default UserProfile;
