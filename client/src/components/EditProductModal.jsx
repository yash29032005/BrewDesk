import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EditProductModal = ({ onClose, item, setProducts }) => {
  const id = item.product_id;
  const [name, setName] = useState(item.product_name);
  const [category, setCategory] = useState(item.product_category);
  const [price, setPrice] = useState(item.product_price);

  const handleEdit = async () => {
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/product/${id}`,
        {
          name,
          category,
          price,
        },
        {
          withCredentials: true,
        }
      );
      setName("");
      setCategory("");
      setPrice("");
      toast.success(result.data.message);
      const updatedProduct = result.data.product;

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.product_id === id ? updatedProduct : p))
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
                Edit Product Details
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
              placeholder="Enter product name"
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
              placeholder="Enter Category"
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
              type="text"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="Enter price"
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
              onClick={() => handleEdit(item)}
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

export default EditProductModal;
