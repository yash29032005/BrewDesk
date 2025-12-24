import React, { useContext, useState } from "react";

import { CiShoppingCart } from "react-icons/ci";
import { BsCup } from "react-icons/bs";
import RequestStockModal from "./RequestStockModal";
import EditProductModal from "../EditProductModal";
import { ProductContext } from "../../context/ProductContext";

const InventoryManagement = () => {
  const [openRequestStock, setOpenRequestStock] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);

  const { products, setProducts, loading } = useContext(ProductContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lightgrey dark:text-darkgrey">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-lightprimary dark:bg-darkprimary p-5 w-screen"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {/* Products */}
        <div
          className="bg-lightsecondary dark:bg-darksecondary h-full 
          rounded-lg overflow-y-auto p-5"
        >
          <div className="flex items-center mb-4">
            <p
              className="flex items-center gap-2 text-xl md:text-2xl text-black dark:text-white font-semibold 
            btn btn-light"
            >
              <CiShoppingCart className="text-md" />
              Products
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((item) => item.product_enabled)
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-lightternary to-lightprimary
        dark:bg-gradient-to-b dark:from-darkternary dark:to-darkprimary 
        text-white p-5 rounded-lg shadow-md flex flex-col justify-between
        min-h-[200px] md:min-h-[300px]"
                >
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <BsCup className="text-4xl text-black dark:text-white" />
                  </div>

                  <div className="mt-3 relative">
                    <p className="font-bold text-lg text-black dark:text-white">
                      {item.product_name}
                    </p>
                    <p className="text-sm opacity-80 text-lightgrey dark:text-darkgrey">
                      {item.product_category}
                    </p>
                    <p className="mt-1 font-semibold text-black dark:text-white">
                      ₹{item.product_price.toFixed(2)}
                    </p>
                    <span
                      className="absolute bottom-0 right-0 text-xs bg-lightprimary dark:bg-darkprimary 
            text-black dark:text-white rounded-full px-3 py-1"
                    >
                      Stock: {item.product_stock}
                    </span>

                    {/* Edit Button */}
                    <span
                      onClick={() => setOpenEditProductModal(item)}
                      className="absolute top-0 right-30 text-xs bg-lightsecondary dark:bg-darksecondary text-black 
            dark:text-white rounded-md px-4 py-2 cursor-pointer hover:opacity-80 transition"
                    >
                      Edit
                    </span>
                    {/* Edit Modal */}
                    {openEditProductModal && (
                      <EditProductModal
                        item={openEditProductModal}
                        setProducts={setProducts}
                        onClose={() => setOpenEditProductModal(null)}
                      />
                    )}

                    <span
                      onClick={() => setOpenRequestStock(item)}
                      className="absolute top-0 right-0 text-xs bg-lightsecondary dark:bg-darksecondary text-black 
            dark:text-white rounded-md px-4 py-2 cursor-pointer hover:opacity-80 transition"
                    >
                      Request Stock
                    </span>
                    {openRequestStock && (
                      <RequestStockModal
                        product={openRequestStock}
                        onClose={() => {
                          setOpenRequestStock(false);
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

export default InventoryManagement;
