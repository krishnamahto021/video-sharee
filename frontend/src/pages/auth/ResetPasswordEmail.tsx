import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface ResetPasswordEmail {
  success: true;
  message: string;
}

const ResetPasswordEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await axios.post<ResetPasswordEmail>(
      "/api/v1/auth/send-reset-password-email",
      {
        email,
      }
    );
    if (data.success) {
      toast.success(data.message);
      setEmail("");
      navigate("/sign-in");
    }
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-bgOne">
      <form className=" w-screen sm:w-1/2  p-5 z-10" onSubmit={handleSubmit}>
        <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl  my-7">
          Reset your password
        </h1>
        <label htmlFor="email">
          <div className="text-textOne my-2">Email *</div>
          <input
            type="text"
            name="email"
            required
            className="w-full p-4 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] "
            placeholder="Enter your email "
            value={email}
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          className="bg-bgFive mt-3 rounded-md p-2 text-white text-lg w-full hover:bg-opacity-90 duration-300 capitalize  "
        >
          Reset your password
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

export default ResetPasswordEmail;
