import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { signUpUser } from "../../redux/reducers/auth/authReducer";
import { AuthFormData } from "../../types";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../redux/reducers/auth/authReducer"; // Import selectors

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading); // Get loading state from Redux
  const error = useSelector(selectAuthError); // Get error state from Redux

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signUpUser(formData));
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Join Us Today
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p> // Display error message
            )}

            {/* Sign Up Button with Loader */}
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-green-500 text-white font-bold rounded-md shadow-md transition duration-300 
              disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center ${
                loading ? "bg-opacity-90" : "hover:bg-opacity-90"
              }`}
              disabled={loading} // Disable button when loading
            >
              {loading ? ( // Show loader if loading
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    ></path>
                  </svg>
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Already have an account?
              </span>{" "}
              <Link
                to="/sign-in"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
