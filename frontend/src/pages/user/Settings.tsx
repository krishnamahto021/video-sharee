import React, { useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

const Settings: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [privacy, setPrivacy] = useState<boolean>(true);

  const handleSaveClick = () => {
    // Implement save functionality here
    toast.success("Settings saved successfully!");
  };

  return (
    <Layout>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 mt-7 ml-0 md:ml-64">
          <section className="p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-center font-semibold text-xl text-gray-700 mb-5">
              Settings
            </h1>
            <div className="container flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="font-medium text-gray-600">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="font-medium text-gray-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <FaBell className="text-gray-600" />
                <label
                  htmlFor="notifications"
                  className="font-medium text-gray-600"
                >
                  Notifications
                </label>
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="ml-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <MdOutlinePrivacyTip className="text-gray-600" />
                <label htmlFor="privacy" className="font-medium text-gray-600">
                  Privacy
                </label>
                <input
                  id="privacy"
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="ml-2"
                />
              </div>

              <div className="flex items-center justify-center mt-7">
                <button
                  type="button"
                  className="bg-blue-500 rounded-md p-3 text-white text-lg hover:bg-blue-600 duration-300"
                  onClick={handleSaveClick}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Settings;
