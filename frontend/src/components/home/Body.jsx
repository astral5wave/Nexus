import { useEffect, useState, useRef, useMemo } from "react";
import AddNewContact from "./body/AddNewContact";
import DownloadContacts from "./body/DownloadContacts";
import { SearchContacts } from "./body/SearchContacts";
import { FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import Table from "./body/Table";
import ContactModal from "./body/ContactModal";

const Body = () => {
  const [contactData, setContactData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [error, setError] = useState("");
  const [contactModalConfig, setContactModalConfig] = useState({
    open: false,
    mode: "",
    userData: {},
  });
  const ref = useRef(null);

  const fetchUserContacts = async () => {
    try {
      const respone = await axiosInstance.get("/contact");
      const contact = respone.data?.contacts || [];
      setContactData(contact);
    } catch (error) {
      setError(error.respone?.message || error.message);
    }
  };

  const deleteSelectedRows = async () => {
    const selectedRows = ref.current.getSelectedRowsIds();
    if (selectedRows.length === 0) return;
    try {
      const response = axiosInstance.delete("/contact/delete", {
        data: { ids: selectedRows },
      });
      await fetchUserContacts();
    } catch (error) {
      setError(error.respone?.message || error.message);
    }
  };

  const clearSearch = () => {
    setSearchString("");
  };
  useEffect(() => {
    fetchUserContacts();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen w-[90%] mx-auto mt-2 overflow-hidden">
        <div className="text-lg text-primary font-bold">
          Contacts{" "}
          <span className="text-sm text-neutral-500">
            {contactData?.length || 0} Contacts
          </span>
        </div>
        <div className="flex items-baseline-last justify-between">
          <div className="flex justify-start items-center gap-6 w-1/3">
            <AddNewContact setContactModalConfig={setContactModalConfig} />
            <button
              onClick={fetchUserContacts}
              className="flex items-center justify-center font-semibold border-2 border-primary text-white bg-primary rounded-lg p-1 shadow-sm transition-all duration-200 hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <FiRefreshCcw size={20} />
            </button>
            <SearchContacts
              searchString={searchString}
              setSearchString={setSearchString}
              clearSearch={clearSearch}
            />
            <button
              onClick={deleteSelectedRows}
              className="flex items-center justify-center font-semibold border-2 border-red-500 text-white bg-red-500 rounded-lg p-1 shadow-sm transition-all duration-200 hover:bg-white hover:text-red-500 hover:shadow-md active:scale-95"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
          {error && <p className="text-lg text-red-500">* {error}</p>}
          <DownloadContacts contacts={contactData} />
        </div>
        <Table
          data={contactData}
          ref={ref}
          searchString={searchString}
          setSearchString={setSearchString}
          setContactModalConfig={setContactModalConfig}
        />
      </div>
      {contactModalConfig.open && (
        <ContactModal
          closeModal={() =>
            setContactModalConfig({
              open: false,
              mode: "",
              userData: {},
            })
          }
          contactModalConfig={contactModalConfig}
          fetchUserContacts={fetchUserContacts}
        />
      )}
    </>
  );
};

export default Body;
