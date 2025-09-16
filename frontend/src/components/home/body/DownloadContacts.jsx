import React from "react";
import { IoMdDownload } from "react-icons/io";
import { downloadContactsPdf } from "../../../utils/downloadContactsPdf";

const DownloadContacts = ({ contacts }) => {
  return (
    <button
      onClick={() => downloadContactsPdf(contacts)}
      className="flex gap-2 items-center justify-center text-sm font-semibold border-2 border-primary text-primary bg-white rounded-lg px-2 py-1 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md active:scale-95"
    >
      <IoMdDownload /> Download
    </button>
  );
};

export default DownloadContacts;
