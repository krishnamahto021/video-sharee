import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  selectLoggedInUser,
  updateUser,
} from "../../redux/reducers/auth/authReducer";
import backendApi from "../../api/axios";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";
import { AppDispatch } from "../../redux/store";

interface AuthResponse {
  success: boolean;
  message: string;
  data?: object;
}

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector(selectLoggedInUser);
  const { configWithJWT } = useConfig();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // Added email state
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  useEffect(() => {
    if (loggedInUser?.name) {
      setName(loggedInUser.name);
    }
    if (loggedInUser?.email) {
      setEmail(loggedInUser.email);
    }
  }, [loggedInUser]);

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    setLoading(true); // Set loading to true when starting the save process
    try {
      const { data } = await backendApi.post<AuthResponse>(
        "/api/v1/user/update-profile",
        { name, email }, // Added email to update
        configWithJWT
      );

      if (data.success) {
        if (data.data) {
          dispatch(updateUser({ name, email })); // Updated to include email
        }
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false after the save process is complete
      setEdit(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch]);

  return (
    <div className="flex w-full pr-2 h-screen">
      <Sidebar />
      <main className="flex-1 ml-4 lg:ml-[17rem] pr-2 z-10">
        <section className="p-4 bg-white shadow-lg rounded-lg w-full mt-8">
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
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="font-medium text-gray-600">
                  Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 focus:outline-none border rounded-md ${
                      edit ? "border-blue-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                    disabled={!edit}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600"
                onClick={() => (edit ? handleSaveClick() : handleEditClick())}
              >
                {loading ? "Saving..." : edit ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
