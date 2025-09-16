import { TiUserAdd } from "react-icons/ti";

const AddNewContact = ({ setContactModalConfig }) => {
  return (
    <>
      <button
        onClick={() =>
          setContactModalConfig({
            open: true,
            mode: "add",
            userData: {},
          })
        }
        className="flex gap-2 items-center justify-center text-sm font-semibold border-2 border-primary text-white bg-primary rounded-lg px-3 py-1 shadow-sm transition-all duration-200 hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
      >
        <TiUserAdd size={20} /> Add
      </button>
    </>
  );
};

export default AddNewContact;
