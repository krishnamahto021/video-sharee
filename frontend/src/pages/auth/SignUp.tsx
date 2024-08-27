import React from "react";

const SignUp: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 bg-bgOne">
      <form className=" w-screen sm:w-1/2  p-5 z-10">
        <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl  my-7">
          Signup to Video Share
        </h1>
        <label htmlFor="email">
          <div className="text-textOne my-2">Email / Username *</div>
          <input
            type="text"
            name="email"
            required
            className="w-full p-4 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] "
            placeholder="Enter your email or username"
          />
        </label>
        <label htmlFor="password">
          <div className="text-textOne my-2">Password *</div>
          <input
            type="password"
            name="password"
            required
            className="w-full p-4 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] "
            placeholder="Enter your password"
          />
        </label>
        <button
          type="submit"
          className="bg-bgFive w-full rounded-md p-2 text-white text-lg mt-5 block m-auto hover:bg-opacity-90 duration-300 capitalize "
        >
          Sign Up
        </button>
        <p className="mt-3">
          Already have an account?
          <div className="font-bold underline mt-3 text-textTwo cursor-pointer ">
            Log in
          </div>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
