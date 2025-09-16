import { useEffect, useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [authType, setAuthType] = useState("login");
  const navigate=useNavigate();

  useEffect(()=>{
   const token=localStorage.getItem("token");
   if(token){
    navigate("/home",{replace:true});
   }
  },[navigate]);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-pink-700"></div>
      <div className="h-[300px] w-[300px] rotate-45 bg-blue-400 absolute top-20 left-[-150px] opacity-30 rounded-2xl"></div>
      <div className="h-[500px] w-[500px] rotate-45 bg-cyan-600 absolute bottom-[-200px] left-1/9 opacity-45 rounded-2xl"></div>
      <div className="h-[400px] w-[400px] rotate-45 bg-pink-500 absolute top-1/3 right-[-200px] opacity-40 rounded-2xl"></div>
      <div className="h-[250px] w-[250px] rotate-45 bg-purple-700 absolute bottom-20 right-40 opacity-40 rounded-2xl"></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        {authType === "login" ? <LoginCard setAuthType={setAuthType}/> : <SignupCard setAuthType={setAuthType}/>}
      </div>
    </div>
  );
};

export default Auth;
