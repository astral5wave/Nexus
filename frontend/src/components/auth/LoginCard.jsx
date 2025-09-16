import React, { useReducer, useState } from "react";
import { MdEmail, MdPassword } from "react-icons/md";
import { FaFacebook, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import OAuthProviders from "./OAuthProviders";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "emailChange":
      return {
        email: action.payload,
        password: state.password,
      };
    case "passwordChange":
      return {
        email: state.email,
        password: action.payload,
      };
    default:
      return {
        email: "",
        password: "",
      };
  }
};

const LoginCard = ({ setAuthType }) => {
  const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
  const [isPassword, setIsPassword] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    const { email, password } = state;
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    const passowrdStr = password.toString().trim();
    if (passowrdStr.length < 8 || passowrdStr.length > 15) {
      setError("Password must be between 8 to 15 characters");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.error === false) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/home", { replace: true });
      } else {
        setError("Login failed, please try again");
        return;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      return;
    }
    setError("");
    return;
  };
  return (
    <div className="relative h-11/12 w-1/4 bg-white rounded-xl flex flex-col justify-between items-center">
      <form
        className="flex flex-col w-full justify-between items-center py-8 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="font-bold font-sans text-4xl text-gray-950/90 py-4 ">
          Login
        </div>

        <div className="flex flex-col items-center w-full my-2">
          <div className="w-full px-12">
            <label
              htmlFor="emailLogin"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <MdEmail className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
              <input
                type="email"
                id="emailLogin"
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: "emailChange",
                    payload: e.target.value,
                  })
                }
                placeholder="Enter your email"
                className="w-full px-10 py-2 bg-white border-b-2 border-gray-300
                     text-gray-900 placeholder-gray-400 
                     focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full my-2">
          <div className="w-full px-12">
            <label
              htmlFor="passwordLogin"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <TbLockPassword className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
              <input
                type={isPassword ? "password" : "text"}
                id="passwordLogin"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: "passwordChange",
                    payload: e.target.value,
                  })
                }
                placeholder="Enter your passowrd"
                className="w-full px-10 py-2 bg-white border-b-2 border-gray-300
                     text-gray-900 placeholder-gray-400 
                     focus:outline-none focus:border-gray-400"
              />
              <button
                type="button"
                className="flex items-center justify-center"
                onClick={() => {
                  setIsPassword(!isPassword);
                }}
              >
                {isPassword ? (
                  <FaRegEye className="absolute right-3 text-gray-500 text-xl" />
                ) : (
                  <FaRegEyeSlash className="absolute right-3 text-gray-500 text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-6">
          <button type="submit" className="authButton">
            Login
          </button>
        </div>

        {error && <p className="text-xs text-red-500 px-2">{`* ${error}`}</p>}

      </form>

      <div className="w-full flex flex-col justify-center items-center mb-15">

        <OAuthProviders setError={setError} />

        <div className="text-gray-400 text-xs font-semibold">
          Or Click here to
        </div>

        <button
          onClick={() => setAuthType("signup")}
          className="flex justify-center items-center text-gray-700 underline underline-offset-2"
        >
          Sign Up
        </button>
        
      </div>
    </div>
  );
};

export default LoginCard;
