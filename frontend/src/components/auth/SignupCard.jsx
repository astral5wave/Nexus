import React, { useState, useReducer } from "react";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import OAuthProviders from "./OAuthProviders";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "nameChange":
      return {
        name: action.payload,
        email: state.email,
        password: state.password,
      };
    case "emailChange":
      return {
        name: state.name,
        email: action.payload,
        password: state.password,
      };
    case "passwordChange":
      return {
        name: state.name,
        email: state.email,
        password: action.payload,
      };
    default:
      return {
        name: "",
        email: "",
        password: "",
      };
  }
};
const SignupCard = ({ setAuthType }) => {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    email: "",
    password: "",
  });
  const [isPassword, setIsPassword] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { name, email, password } = state;
    if (!name || !email || !password) {
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
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      if (response.data.error === false) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/home", { replace: true });
      } else {
        setError("Registration failed, please try again");
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
      onSubmit={(e)=>{
        e.preventDefault();
        handleSignup();
      }}
      className="flex flex-col w-full justify-center items-center py-8 gap-4">
        <div className="font-bold font-sans text-4xl text-gray-950/90 py-4 ">
          Sign Up
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full px-12">
            <label
              htmlFor="nameSignup"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
              <input
                type="name"
                id="nameSignup"
                placeholder="Enter your name"
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "nameChange",
                    payload: e.target.value,
                  })
                }
                className="w-full px-10 py-2 bg-white border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full px-12">
            <label
              htmlFor="emailSignup"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <MdEmail className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
              <input
                type="email"
                id="emailSignup"
                placeholder="Enter your email"
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: "emailChange",
                    payload: e.target.value,
                  })
                }
                className="w-full px-10 py-2 bg-white border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full px-12">
            <label
              htmlFor="passwordSignup"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <TbLockPassword className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
              <input
                type={isPassword ? "password" : "text"}
                id="passwordSignup"
                placeholder="Enter your passowrd"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: "passwordChange",
                    payload: e.target.value,
                  })
                }
                className="w-full px-10 py-2 bg-white border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
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
          <button 
          type="submit"
          className="authButton">
            Sign Up
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{`* ${error}`}</p>}
      
      </form>

      <div className="w-full flex flex-col justify-center items-center mb-15">
        
        <OAuthProviders setError={setError}/>

        <div className="text-gray-400 text-xs font-semibold">
          Or Click here to
        </div>
        
        <button
          className="flex justify-center items-center text-gray-700 underline underline-offset-2"
          onClick={() => {
            setAuthType("login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignupCard;
