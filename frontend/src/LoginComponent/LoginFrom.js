import React, { useState } from "react";
import InputField from "./InputField";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState('#ffffff');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div
      className="flex flex-col w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-2xl font-light tracking-wider text-center mb-6">LOGIN</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        
        <InputField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
          >
            Sign in
          </button>
        </div>

        <SocialLogin />

        <div className="mt-4 text-center">
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
