import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const RequestStockModal = ({ onClose, product }) => {
  const { user } = useContext(UserContext);
  const productId = product.id;
  const employeeId = user.id;
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stock/request`,
        { productId, employeeId, quantity },
        { withCredentials: true }
      );
      onClose();
      toast.success(result.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
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
                Request Stock
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
            <label htmlFor="product" className="text-sm ms-1 font-bold">
              Product Name
            </label>
            <p
              id="product"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary 
               text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {product.product_name}
            </p>
          </div>
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="quantity" className="text-sm ms-1 font-bold">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              min={0}
              placeholder="Enter quantity to request"
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary 
               text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
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
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary rounded-lg text-black dark:text-white"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestStockModal;
