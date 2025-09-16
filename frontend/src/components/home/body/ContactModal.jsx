import { useReducer, useState, useContext } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../../utils/axiosInstance";

const reducer = (state, action) => {
  switch (action.type) {
    case "update_field":
      const newState = {
        ...state,
        [action.field]: action.payload,
      };
      newState.canSubmit = Boolean(
        newState.firstName && newState.contactCode && newState.contactNumber
      );
      return newState;
    default:
      return state;
  }
};

const ContactModal = ({ closeModal, contactModalConfig,fetchUserContacts }) => {
  const [state, dispacth] = useReducer(reducer, {
    firstName: contactModalConfig.userData?.firstName || "",
    lastName: contactModalConfig.userData?.lastName || "",
    email: contactModalConfig.userData?.email || "",
    contactCode: contactModalConfig.userData?.contactCode || "",
    contactNumber: contactModalConfig.userData?.contactNumber || "",
    _id: contactModalConfig.userData?._id || "",
    canSubmit: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmitForm = state.canSubmit && !isSubmitting;
  const canCloseModal = !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validators = [
      {
        valid: state.firstName && state.contactCode && state.contactNumber,
        message: "Required fields are necessary to be filled",
      },
      {
        valid: !state.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email),
        message: "Please enter a valid email address",
      },
      {
        valid: !isNaN(state.contactCode) && !isNaN(state.contactNumber),
        message: "Contact must be a number",
      },
      {
        valid: state.contactNumber?.toString().length === 10,
        message: "Number must be 10 digits long",
      },
    ];
    for (const { valid, message } of validators) {
      if (!valid) {
        setError(message);
        return;
      }
    }
    setIsSubmitting(true);
    setError("");
    try {
      let response = {};
      if (contactModalConfig.mode === "add") {
        response = await axiosInstance.post("/contact", {
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          contactCode: state.contactCode,
          contactNumber: state.contactNumber,
        });
      } else {
        response = await axiosInstance.put(`/contact/${state._id}`, {
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          contactCode: state.contactCode,
          contactNumber: state.contactNumber,
        });
      }
      if (response.data?.error == false) {
        await fetchUserContacts();
        closeModal();
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-800">
           {contactModalConfig.mode==="add"?"Add New Contact":"Update Contact"}
          </h2>
          <button
            onClick={() => closeModal()}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => {
                dispacth({
                  type: "update_field",
                  field: "firstName",
                  payload: e.target.value,
                });
              }}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Last Name
            </label>
            <input
              type="text"
              value={state.lastName}
              onChange={(e) => {
                dispacth({
                  type: "update_field",
                  field: "lastName",
                  payload: e.target.value,
                });
              }}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
              placeholder="Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => {
                dispacth({
                  type: "update_field",
                  field: "email",
                  payload: e.target.value,
                });
              }}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
              placeholder="johndoe@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="tel"
                value={state.contactCode}
                onChange={(e) => {
                  dispacth({
                    type: "update_field",
                    field: "contactCode",
                    payload: e.target.value,
                  });
                }}
                className="w-1/4 rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
                placeholder="+91"
              />
              <input
                type="tel"
                value={state.contactNumber}
                onChange={(e) => {
                  dispacth({
                    type: "update_field",
                    field: "contactNumber",
                    payload: e.target.value,
                  });
                }}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all"
                placeholder="1234-567-890"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">* {error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={!canCloseModal}
              onClick={() => closeModal()}
              className={`px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-all ${
                isSubmitting ? `cursor-not-allowed` : `cursor-pointer`
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmitForm}
              className={`px-4 py-2 rounded-lg text-white shadow-sm transition-all ${
                canSubmitForm
                  ? `bg-primary  hover:bg-primary/90 cursor-pointer`
                  : `bg-primary/70 cursor-not-allowed`
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ContactModal;
