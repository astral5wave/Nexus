import React, { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "./DeleteAccountModal";

const ProfileDropdown = ({ userEmail }) => {
    const [openDeleteModal,setOpenDeleteModal]=useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    return;
  };
  return (
    <>
      <div className="absolute z-40 top-0 right-6 w-56 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden font-sans">
    
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-medium border-b border-gray-200">
          <MdOutlineEmail size={20} />
          <span className="truncate">{userEmail}</span>
        </div>

        <div className="flex flex-col">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-primary text-base hover:bg-primary/15 transition-colors duration-200 font-semibold"
          >
            <IoIosLogOut size={20} />
            Logout
          </button>
          <button 
          onClick={()=>{
            setOpenDeleteModal(!openDeleteModal);
          }}
          className="flex items-center gap-3 px-4 py-2 text-red-600 text-base hover:bg-red-100 hover:text-red-700 transition-colors duration-200 font-semibold">
            <AiOutlineUserDelete size={20} />
            Delete Account
          </button>
        </div>
      </div>

      <div className="absolute -top-1 right-10 w-3 h-3 bg-blue-50 border-t border-l border-gray-200 rotate-45 z-50"></div>
        {
            openDeleteModal && <DeleteAccountModal email={userEmail} onClose={()=>{setOpenDeleteModal(!openDeleteModal)}}/>

        }
    </>
  );
};

export default ProfileDropdown;
