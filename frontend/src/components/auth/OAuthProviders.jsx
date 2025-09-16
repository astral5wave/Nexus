import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const OAuthProviders = ({setError}) => {
  const handleOAuth =  ({ provider }) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${provider}`;
  };

  return (
    <div className="flex justify-center items-center flex-col my-4">
      <div className="text-gray-400 text-xs font-semibold">
        Or Sign Up using
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <button onClick={() => handleOAuth({ provider: "facebook" })}>
          <FaFacebook className="text-blue-700 text-4xl" />
        </button>
        <button onClick={() => handleOAuth({ provider: "google" })}>
          <FcGoogle className="text-4xl" />
        </button>
      </div>
    </div>
  );
};

export default OAuthProviders;
