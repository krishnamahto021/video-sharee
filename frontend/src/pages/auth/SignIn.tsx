import React, { useState } from "react";
import { signInUser } from "../../redux/reducers/auth/authReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { AuthFormData } from "../../types";
import { Link, useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signInUser({ ...formData, navigate }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email "
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between items-center">
            <Link
              to="/reset-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-md shadow-md hover:bg-opacity-90 transition duration-300"
          >
            Sign In
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Don't have an account?
            </span>{" "}
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
  );
};

export default SignIn;
