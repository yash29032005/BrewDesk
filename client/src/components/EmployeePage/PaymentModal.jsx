import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const PaymentModal = ({ onClose, cart, setCart }) => {
  const [customerName, setCustomerName] = useState("");
  const { user } = useContext(UserContext);
  const [paymentMethod, setPaymentMethod] = useState("");

  // ✅ Place Order API call
  const placeOrder = async (paymentId = null) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        {
          userId: user.emp_id,
          customerName,
          cart,
          paymentMethod,
          paymentId,
        },
        { withCredentials: true }
      );
      toast.success(result.data.message);
      setCart([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Razorpay Payment
  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your internet.");
      return;
    }

    try {
      // Step 1: Create order on backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/payment`,
        { amount: calculateTotal() },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Cafe POS",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          toast.success("Payment Successful!");
          await placeOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: customerName,
          email: user.emp_email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  // ✅ Calculate total amount
  const calculateTotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.product_price * item.product_qty,
      0
    );
  };

  // ✅ Main Order button
  const handleOrder = () => {
    if (!customerName || !paymentMethod) {
      toast.warn("Please fill all fields");
      return;
    }

    if (paymentMethod === "cash") {
      placeOrder();
    } else {
      handleOnlinePayment();
    }
  };

  return (
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
          <h2 className="text-lg font-bold text-black dark:text-white">
            Place Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition duration-200 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
          <label htmlFor="customerName" className="text-sm ms-1 font-bold">
            Customer Name
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            required
            className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
          />
        </div>
        <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
          <label htmlFor="paymentMethod" className="text-sm ms-1 font-bold">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary 
            text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">-- Select a Payment Method --</option>
            <option value="cash">Cash</option>
            <option value="online">Card/UPI (Online)</option>
          </select>
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
            onClick={handleOrder}
            className="px-5 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
              dark:from-darkternary dark:to-darkprimary rounded-lg text-black dark:text-white"
          >
            {paymentMethod === "Online" ? "Pay & Order" : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
