import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { BsCup } from "react-icons/bs";
import AddModal from "./AddModal";
import CheckRequestModal from "./CheckRequestModal";
import { ProductContext } from "../../context/ProductContext";

const StockRequest = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openCheckRequestModal, setOpenCheckRequestModal] = useState(false);
  const { products } = useContext(ProductContext);

  return (
    <div
      className="bg-lightprimary dark:bg-darkprimary p-5 w-screen"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div
        className="bg-lightsecondary dark:bg-darksecondary h-full rounded-lg 
        overflow-y-auto p-5"
      >
        <div className="relative">
          <div className="flex justify-between mb-4">
            <p className="flex items-center gap-2 text-xl md:text-2xl text-black dark:text-white font-semibold">
              <BsCup className="text-md" /> Stock Requests
            </p>

            <p
              onClick={() => setOpenCheckRequestModal((prev) => !prev)}
              className="flex items-center text-xs text-black dark:text-white bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary rounded-md px-4 py-2 hover:opacity-90"
            >
              Check Requests
            </p>
          </div>
          {openCheckRequestModal ? (
            <CheckRequestModal
              onClose={() => setOpenCheckRequestModal(false)}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {products.map((pro) => (
            <div
              key={pro.product_id}
              className="bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary text-white px-5 py-3 
                rounded-lg shadow-md flex flex-row items-center justify-between"
            >
              {/* Product icon */}
              <div className="flex items-center justify-center">
                <span className="text-2xl me-5">
                  <BsCup className="text-4xl text-black dark:text-white" />
                </span>
              </div>

              {/* Request details */}
              <div className="flex-1">
                <p className="font-bold text-md text-black dark:text-white">
                  {pro.product_name}
                </p>
                <p className="mt-1 text-sm font-semibold text-lightgrey dark:text-darkgrey">
                  Stock: {pro.product_stock}
                </p>
              </div>

              <div className="flex items-center">
                <span
                  onClick={() => setOpenAddModal(pro)}
                  className="text-xs bg-lightsecondary dark:bg-darksecondary text-black 
                  dark:text-white rounded-full p-2 cursor-pointer hover:opacity-80 transition flex items-center gap-1"
                >
                  <FaPlus />
                  Add
                </span>
                {/* Modal */}
                {openAddModal && (
                  <AddModal
                    product={openAddModal}
                    onClose={() => setOpenAddModal(null)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockRequest;
