import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddProductModal = ({ onClose, setProducts }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(null);

  const handleInsert = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product`,
        {
          name,
          category,
          price,
          stock,
        },
        { withCredentials: true }
      );
      setName("");
      setCategory("");
      setPrice(0);
      setStock(0);
      onClose();
      toast.success(result.data.message);
      console.log(result);

      setProducts((prev) => [...prev, result.data.product]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order failed");
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
                Add Product
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
            <label htmlFor="name" className="text-sm ms-1 font-bold">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter file name"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
            />
          </div>
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="category" className="text-sm ms-1 font-bold">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter file name"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
            />
          </div>
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="price" className="text-sm ms-1 font-bold">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              min={0}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter file name"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
            />
          </div>

          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="stock" className="text-sm ms-1 font-bold">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter file name"
              required
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
              onClick={handleInsert}
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

export default AddProductModal;
