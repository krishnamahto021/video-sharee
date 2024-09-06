import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import backendApi from "../../api/axios";
import { toast } from "sonner";
import Layout from "../../components/Layout";

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await backendApi.post<ResetPasswordResponse>(
      `/api/v1/auth/reset-password/${token}`,
      { password }
    );
    if (data.success) {
      toast.success(data.message);
      setPassword("");
      navigate("/sign-in");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Reset Your Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-md shadow-md hover:bg-opacity-90 transition duration-300"
            >
              Update Password
            </button>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Not a member yet?</span>{" "}
              <Link
                to="/sign-up"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up for free
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
