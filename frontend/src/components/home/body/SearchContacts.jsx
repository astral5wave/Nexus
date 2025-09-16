import React, { useState } from "react";
import { TbXboxX } from "react-icons/tb";
import { ImSearch } from "react-icons/im";

export const SearchContacts = ({
  searchString,
  setSearchString,
  clearSearch,
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
          placeholder="Search"
          className="w-full pr-10 pl-4 py-1 text-base rounded-lg border border-neutral-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all duration-200"
        />
        {searchString && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer hover:text-primary transition-colors duration-200"
          >
            <TbXboxX size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
