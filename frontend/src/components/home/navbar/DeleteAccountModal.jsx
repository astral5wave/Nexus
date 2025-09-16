import React, { useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ email, onClose }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (input !== email) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axiosInstance.delete("/user/delete");
      if (res.status === 200) {
        localStorage.clear();
        navigate("/", { replace: true });
      } else {
        setErrorMsg("Deletion failed. Try again.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Your Account
        </h2>
        <p className="text-gray-700 mb-4">
          This action is <span className="font-semibold">permanent</span> and
          cannot be undone. To confirm, please type your email address:
        </p>

        <input
          type="text"
          placeholder={email}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:border-red-500"
        />

        {errorMsg && (
          <p className="text-sm text-red-600 font-medium mb-2">{errorMsg}</p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={input !== email || loading}
            className={`px-4 py-2 rounded-md font-semibold text-white transition ${
              input === email && !loading
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default DeleteAccountModal;
