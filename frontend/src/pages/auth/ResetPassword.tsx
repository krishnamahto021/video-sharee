import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import backendApi from "../../api/axios";
import { toast } from "sonner";

interface ResetPassword {
  success: boolean;
  message: string;
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await backendApi.post<ResetPassword>(
      `/api/v1/auth/reset-password/${token}`,
      {
        password,
      }
    );
    if (data.success) {
      toast.success(data.message);
      setPassword("");
      navigate("/sign-in");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-bgOne">
      <form className=" w-screen sm:w-1/2  p-5 z-10" onSubmit={handleSubmit}>
        <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl  my-7">
          Reset your password
        </h1>
        <label htmlFor="password">
          <div className="text-textOne my-2">Password *</div>
          <input
            type="password"
            name="password"
            required
            className="w-full p-4 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] "
            placeholder="Enter your password "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-bgFive mt-3 rounded-md p-2 text-white text-lg w-full hover:bg-opacity-90 duration-300 capitalize  "
        >
          Update your password
        </button>
        <p className="mt-3">
          Not a member yet ?
          <Link
            to={"/sign-up"}
            className="font-bold underline mx-3 text-textTwo cursor-pointer "
          >
            Sign up for free
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
