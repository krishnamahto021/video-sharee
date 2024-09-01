import React from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";

const HelpPage: React.FC = () => {
  return (
    <Layout>
      <div className=" flex w-full gap-2 pr-2">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 ml-0 md:ml-64">
          <section className="p-4 mt-7 bg-white shadow-lg rounded-lg">
            <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">
              Help & Feedback
            </h1>
            <div className="container flex flex-col gap-4">
              <p className="text-gray-600">
                If you have any questions or need assistance, feel free to reach
                out to us. We are here to help!
              </p>
              <p className="text-gray-600">
                For any feedback, suggestions, or support, please email us at:
              </p>
              <a
                href="mailto:krishnamahato092001@gmail.com"
                className="text-blue-500 hover:underline"
              >
                krishnamahato092001@gmail.com
              </a>
              <p className="text-gray-600 mt-4">
                We appreciate your feedback and will get back to you as soon as
                possible.
              </p>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default HelpPage;
