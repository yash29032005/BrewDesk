import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ProductContext } from "../../context/ProductContext";

const AddModal = ({ onClose, product }) => {
  const product_id = product.product_id;
  const [quantity, setQuantity] = useState(0);
  const { setProducts } = useContext(ProductContext);

  const addStock = async () => {
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/stock/add/${product_id}`,
        { quantity },
        {
          withCredentials: true,
        }
      );
      setQuantity(0);
      onClose();
      const updatedProduct = result.data.product;
      toast.success(result.data.message);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.product_id === product_id ? updatedProduct : p
        )
      );
    } catch (err) {
      console.error("Error fetching requests:", err);
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
                Add Stock
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
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary 
               text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {product.product_name}
            </p>
          </div>

          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="salary" className="text-sm ms-1 font-bold">
              Product Quantity: {product.product_stock}
            </label>
            <input
              id="salary"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              min={0}
              placeholder="Enter Quantity"
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
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
              onClick={addStock}
              className="px-5 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary rounded-lg text-black dark:text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddModal;
