import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

// eslint-disable-next-line react-refresh/only-export-components
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order`,
          {
            withCredentials: true,
          }
        );
        setOrders(result.data.orders || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    if (user?.emp_role === "employee") {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order/all`,
          {
            withCredentials: true,
          }
        );
        setAllOrders(result.data.orders || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    if (user?.emp_role === "admin") {
      fetchAllOrders();
    }
  }, [user]);

  useEffect(() => {
    const fetchOrdersSummary = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order/summary`,
          { withCredentials: true }
        );
        const map = {};
        result.data.orders.forEach((o) => {
          map[o.user_id] = o.total;
        });
        setOrdersMap(map);
        setTotalOrder(result.data.total);
        setTotalRevenue(result.data.totalRevenue);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.emp_role === "manager" || user?.emp_role === "admin") {
      fetchOrdersSummary();
    }
  }, [setOrdersMap, user?.emp_role]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        allOrders,
        ordersMap,
        setOrdersMap,
        totalOrder,
        totalRevenue,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
