import React, { useContext, useState } from "react";
import axios from "axios";

import { CiShoppingCart } from "react-icons/ci";
import { BsCup } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import AddProductModal from "../AdminPage/AddProductModal";
import EditProductModal from "../EditProductModal";
import { ProductContext } from "../../context/ProductContext";

const ProductManagement = () => {
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);

  const { products, setProducts } = useContext(ProductContext);

  // Function to toggle enable/disable
  const toggleProductStatus = async (item) => {
    const updatedStatus = !item.product_enabled;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((prod) =>
        prod.product_id === item.product_id
          ? { ...prod, product_enabled: updatedStatus }
          : prod
      )
    );

    try {
      // Send request to backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/product/${item.id}/toggle`,
        {
          enabled: updatedStatus,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update product status:", error);

      // Revert UI if request fails
      setProducts((prev) =>
        prev.map((prod) =>
          prod.product_id === item.product_id
            ? { ...prod, product_enabled: item.product_enabled }
            : prod
        )
      );
    }
  };

  return (
    <div
      className="bg-lightprimary dark:bg-darkprimary p-5 w-screen"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* Products */}
      <div className="bg-lightsecondary dark:bg-darksecondary h-full rounded-lg overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="flex items-center gap-2 text-xl md:text-2xl text-black dark:text-white font-semibold btn btn-light">
            <CiShoppingCart className="text-md" />
            Products
          </p>
          <p
            onClick={() => setOpenAddProductModal(true)}
            className="flex items-center gap-2 text-xs text-black dark:text-white bg-gradient-to-b from-lightternary to-lightprimary dark:from-darkternary dark:to-darkprimary rounded-md px-4 py-2 hover:opacity-90"
          >
            <FaPlus className="text-sm" />
            Add Product
          </p>
          {openAddProductModal && (
            <AddProductModal
              setProducts={setProducts}
              onClose={() => setOpenAddProductModal(false)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-b from-lightternary to-lightprimary dark:bg-gradient-to-b dark:from-darkternary dark:to-darkprimary text-white p-5 rounded-lg shadow-md flex flex-col justify-between min-h-[200px] md:min-h-[300px] transition relative ${
                !item?.product_enabled ? "opacity-50" : ""
              }`}
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-4xl">
                  <BsCup className="text-4xl text-black dark:text-white" />
                </span>
              </div>
              <div className="mt-3">
                <p className="font-bold text-lg text-black dark:text-white">
                  {item?.product_name}
                </p>
                <p className="text-sm opacity-80 text-lightgrey dark:text-darkgrey">
                  {item?.product_category}
                </p>
                <p className="mt-1 font-semibold text-black dark:text-white">
                  ₹{item?.product_price}
                </p>
                <span
                  className="absolute bottom-5 right-5 text-xs bg-lightprimary dark:bg-darkprimary 
            text-black dark:text-white rounded-full px-3 py-1"
                >
                  Stock: {item?.product_stock}
                </span>

                {/* Enable/Disable Button */}
                <span
                  onClick={() => toggleProductStatus(item)}
                  className={`absolute top-5 right-5 text-xs rounded-md px-3 py-1 cursor-pointer ${
                    item?.product_enabled
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  } hover:opacity-80 transition`}
                >
                  {item?.product_enabled ? "Enabled" : "Disabled"}
                </span>

                {/* Edit Button */}
                <span
                  onClick={() => setOpenEditProductModal(item)}
                  className="absolute top-50 right-5 text-xs bg-lightsecondary dark:bg-darksecondary text-black dark:text-white rounded-md px-4 py-2 cursor-pointer hover:opacity-80 transition"
                >
                  Edit
                </span>

                {openEditProductModal && (
                  <EditProductModal
                    item={openEditProductModal}
                    setProducts={setProducts}
                    onClose={() => setOpenEditProductModal(false)}
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

export default ProductManagement;
