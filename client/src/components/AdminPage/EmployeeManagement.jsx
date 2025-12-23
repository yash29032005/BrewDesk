import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import EditEmployeeModal from "./EditEmployeeModal";
import RemoveEmployeeModal from "./RemoveEmployeeModal";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";

const EmployeeManagement = () => {
  const { employeesandmanagers } = useContext(UserContext);
  const [openEditEmployeeModal, setOpenEditEmployeeModal] = useState(false);
  const [openRemoveEmployee, setOpenRemoveEmployee] = useState(false);
  const { ordersMap } = useContext(OrderContext);

  return (
    <>
      <div
        className="bg-lightprimary dark:bg-darkprimary p-5 w-screen"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {/* Employees Section */}
        <div
          className="bg-lightsecondary dark:bg-darksecondary h-full rounded-lg 
        overflow-y-auto p-5"
        >
          <div className="flex items-center mb-4">
            <p className="flex items-center gap-2 text-xl md:text-2xl text-black dark:text-white font-semibold">
              <IoPersonOutline className="text-md" /> Employees
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {employeesandmanagers.map((emp, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary text-white px-5 py-3 
                rounded-lg shadow-md flex flex-row items-center justify-between"
              >
                <div className="flex items-center justify-center">
                  <span className="text-2xl me-5">
                    <IoPersonOutline className="text-black dark:text-white" />
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-md text-black dark:text-white">
                    {emp.emp_name}
                  </p>
                  <p className="text-xs opacity-80 text-lightgrey dark:text-darkgrey -mt-1">
                    {emp.emp_role}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                    ₹{emp.emp_salary}
                  </p>
                </div>
                {emp.emp_role === "employee" ? (
                  <div className="me-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-lightsecondary dark:bg-darkprimary text-black dark:text-white">
                      {ordersMap[emp.emp_id] ?? 0} orders
                    </span>
                  </div>
                ) : null}
                {/* <div className="me-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-lightsecondary dark:bg-darkprimary text-black dark:text-white">
                    Active
                  </span>
                </div> */}
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => {
                      setOpenEditEmployeeModal(emp);
                    }}
                    className="text-xs bg-lightsecondary dark:bg-darksecondary text-black 
    dark:text-white rounded-md px-4 py-2 cursor-pointer hover:opacity-80 transition"
                  >
                    Edit
                  </span>
                  {openEditEmployeeModal && (
                    <EditEmployeeModal
                      emp={openEditEmployeeModal}
                      onClose={() => {
                        setOpenEditEmployeeModal(false);
                      }}
                    />
                  )}
                  <span
                    onClick={() => {
                      setOpenRemoveEmployee(emp);
                    }}
                    className="text-xs bg-lightsecondary dark:bg-darksecondary text-black 
    dark:text-white rounded-full p-2 cursor-pointer hover:opacity-80 transition"
                  >
                    <FaMinus />
                  </span>
                  {openRemoveEmployee && (
                    <RemoveEmployeeModal
                      emp={openRemoveEmployee}
                      onClose={() => {
                        setOpenRemoveEmployee(false);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeManagement;
