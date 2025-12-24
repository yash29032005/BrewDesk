import React, { useState, useContext, useEffect } from "react";
import { CiShoppingCart } from "react-icons/ci";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BsCup } from "react-icons/bs";
import { toast } from "react-toastify";
import PaymentModal from "./PaymentModal";
import { ProductContext } from "../../context/ProductContext";

const PointOfSale = () => {
  const { products, setProducts, loading } = useContext(ProductContext);
  const [cart, setCart] = useState([]);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  // Sync cart if product gets disabled
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.filter((item) =>
        products.find(
          (p) => p.product_id === item.product_id && p.product_enabled
        )
      )
    );
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lightgrey dark:text-darkgrey">Loading orders...</p>
      </div>
    );
  }

  // Add product to cart
  const addToCart = (product) => {
    if (!product.product_enabled) {
      toast.warn("This product is disabled");
      return;
    }

    if (product.product_stock <= 0) {
      toast.warn("This item is out of stock");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      if (existing) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, product_qty: item.product_qty + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_qty: 1,
            product_enabled: product.product_enabled,
          },
        ];
      }
    });

    // Reduce stock in products
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.product_id === product.product_id
          ? { ...p, product_stock: p.product_stock - 1 }
          : p
      )
    );
  };

  // Increase quantity
  const increaseQty = (id) => {
    const product = products.find((p) => p.product_id === id);
    if (!product || !product.product_enabled || product.product_stock <= 0)
      return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === id
          ? { ...item, product_qty: item.product_qty + 1 }
          : item
      )
    );

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.product_id === id ? { ...p, product_stock: p.product_stock - 1 } : p
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product_id === id && item.product_qty > 0) {
            // Add back stock
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.product_id === id
                  ? { ...p, product_stock: p.product_stock + 1 }
                  : p
              )
            );
            return { ...item, product_qty: item.product_qty - 1 };
          }
          return item;
        })
        .filter((item) => item.product_qty > 0)
    );
  };

  // Calculate total
  const totalPrice = cart.reduce(
    (total, item) => total + item.product_price * item.product_qty,
    0
  );

  return (
    <div
      className="bg-lightprimary dark:bg-darkprimary flex flex-col md:flex-row p-5 gap-5 w-screen"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* Left Side - Products */}
      <div className="bg-lightsecondary dark:bg-darksecondary h-6/12 md:h-full w-full md:w-8/12 rounded-lg overflow-y-auto p-5">
        <p className="flex items-center gap-2 text-2xl text-black dark:text-white font-semibold mb-4">
          <CiShoppingCart className="text-xl" />
          Products
        </p>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <p className="text-black dark:text-white">No products available</p>
          ) : (
            products
              .filter((item) => item.product_enabled) // ✅ only enabled products
              .map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: item.product_stock > 0 ? 1.05 : 1,
                  }}
                  whileTap={{ scale: item.product_stock > 0 ? 0.95 : 1 }}
                  className={`bg-gradient-to-b from-lightternary to-lightprimary 
            dark:from-darkternary dark:to-darkprimary text-white p-5 
            rounded-lg shadow-md flex flex-col justify-between
            min-h-[200px] md:min-h-[300px] transition cursor-pointer
            ${
              item.product_stock <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg"
            }`}
                  onClick={() => item.product_stock > 0 && addToCart(item)}
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
                      ₹{Number(item.product_price).toFixed(2)}
                    </p>
                    <span className="absolute bottom-0 right-0 text-xs bg-lightprimary dark:bg-darkprimary text-black dark:text-white rounded-full px-3 py-1">
                      {item.product_stock > 0
                        ? `Stock: ${item.product_stock}`
                        : "Out of Stock"}
                    </span>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>

      {/* Right Side - Current Order */}
      <div className="bg-lightsecondary dark:bg-darksecondary w-full md:w-4/12 rounded-lg p-5 h-6/12 md:h-full flex flex-col">
        <p className="text-xl font-semibold text-black dark:text-white">
          Current Order
        </p>

        {cart.length === 0 ? (
          <p className="mt-3 text-sm opacity-70 text-lightgrey dark:text-darkgrey">
            No items in cart
          </p>
        ) : (
          <div className="flex-1 flex flex-col justify-between mt-3">
            <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
              {cart.map((item, index) => {
                const product = products.find(
                  (p) => p.product_id === item.product_id
                );
                const isEnabled = product ? product.product_enabled : true;
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-lightprimary dark:bg-darkprimary 
                    rounded-lg p-3 shadow-sm"
                  >
                    {isEnabled ? (
                      <>
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-lightgrey dark:text-darkgrey">
                            ₹{Number(item.product_price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.product_id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                          >
                            -
                          </button>
                          <span className="text-black dark:text-white min-w-[20px] text-center">
                            {item.product_qty}
                          </span>
                          <button
                            onClick={() => increaseQty(item.product_id)}
                            className={`px-2 py-1 rounded-md transition ${
                              product.product_stock > 0
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                            disabled={product.product_stock <= 0}
                          >
                            +
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-500 font-semibold">
                        This product is disabled
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total & Checkout */}
            <div className="mt-3 border-t border-lightgrey dark:border-darkgrey pt-3">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-black dark:text-white">
                  Total:
                </p>
                <p className="font-bold text-black dark:text-white">
                  ₹{totalPrice.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setOpenPaymentModal(true)}
                className="w-full text-black dark:text-white 
                 bg-gradient-to-b from-lightternary to-lightprimary 
                 dark:from-darkternary dark:to-darkprimary 
                 py-2 rounded-lg shadow-md hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
              {openPaymentModal && (
                <PaymentModal
                  cart={cart}
                  setCart={setCart}
                  onClose={() => setOpenPaymentModal(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointOfSale;
