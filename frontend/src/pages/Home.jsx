import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import axiosInstance from "../utils/axiosInstance";
import Body from "../components/home/Body";


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const token =
    searchQuery.get("token") || localStorage.getItem("token") || null;
  const [userInfo, setUserInfo] = useState({name:"",email:""});

  const fetchUser = async () => {
  if (token) {
    localStorage.setItem("token", token);
    navigate(location.pathname, { replace: true });
    try {
      const response = await axiosInstance.get("/user/details");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  } else {
    handleLogout();
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  setUserInfo({name:"",email:""}); 
  navigate("/", { replace: true });
};

  useEffect(() => {
    fetchUser();
  }, [token, navigate]);

  return (
    <>
      <div className="fixed w-full">
        <Navbar userInfo={userInfo} />
        <Body/>
      </div>
    </>
  );
};

export default Home;
