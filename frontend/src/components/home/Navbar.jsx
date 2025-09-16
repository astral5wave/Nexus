import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import ProfileDropdown from "./navbar/ProfileDropdown";

const Navbar = ({ userInfo }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative flex justify-between items-center px-6 py-1 border-b border-gray-200 bg-white shadow-sm">
    
      <div className="text-3xl font-extrabold font-display text-primary tracking-tight">
        Nexus
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2  text-accent font-semibold rounded-md hover:bg-accent/5 transition-colors duration-200"
        >
          <span className="underline underline-offset-2 truncate max-w-xs">
            {userInfo.name}
          </span>
          {dropdownOpen ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2">
            <ProfileDropdown userEmail={userInfo.email} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
