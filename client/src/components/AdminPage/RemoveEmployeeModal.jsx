import axios from "axios";
import React from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const RemoveEmployeeModal = ({ onClose, emp }) => {
  const { setEmployeesandmanagers } = useContext(UserContext);

  const handleRemove = async () => {
    try {
      const result = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/employee/${emp.emp_id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(result.data.message);

      // remove deleted employee from state
      setEmployeesandmanagers((prevEmployees) =>
        prevEmployees.filter((e) => e.emp_id !== emp.emp_id)
      );

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-70 backdrop-blur-xs flex items-center justify-center 
      z-50 transition-opacity duration-300"
        onClick={onClose}
      >
        <div
          className="bg-lightprimary dark:bg-darkprimary rounded-2xl p-4 w-11/12 md:w-5/12 shadow-2xl transform transition-all 
        duration-300 scale-100 hover:scale-[1.01]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-black dark:text-white">
                Remove Employee
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition duration-200 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <p className="text-sm ms-1 font-bold">
              Are you sure you want to remove {emp.name}?
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-lightsecondary dark:bg-darksecondary rounded-lg transition duration-200 text-black dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              className="px-5 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary rounded-lg text-black dark:text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveEmployeeModal;
