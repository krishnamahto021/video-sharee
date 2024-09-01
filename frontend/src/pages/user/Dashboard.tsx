import React from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import { selectLoggedInUser } from "../../redux/reducers/auth/authReducer";
import { useSelector } from "react-redux";

const Dashboard: React.FC = () => {
  const loggedInUser = useSelector(selectLoggedInUser);

  return (
    <Layout>
      <div className="flex w-full gap-2 pr-2">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 bg-white shadow-lg rounded-lg ml-0 md:ml-64">
          <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">
            Dashboard
          </h1>
          <div className="container flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-3 justify-around items-center">
              <div className="bg-blue-100 p-6 rounded-lg shadow-md w-full lg:w-1/2">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Uploaded Videos
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {loggedInUser?.uploadCount}
                </p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg shadow-md w-full lg:w-1/2 mt-4 md:mt-0">
                <h2 className="text-lg font-semibold text-green-600 mb-2">
                  Downloaded Videos
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {loggedInUser?.downloadCount}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
