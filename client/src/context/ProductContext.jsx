/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product`,
          { withCredentials: true }
        );
        setProducts(result.data.product || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    if (
      user?.emp_role === "manager" ||
      user?.emp_role === "admin" ||
      user?.emp_role === "employee"
    ) {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    const fetchProductSummary = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/summary`,
          { withCredentials: true }
        );
        setTotalProducts(result.data.total);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.emp_role === "manager" || user?.emp_role === "admin") {
      fetchProductSummary();
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, totalProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
