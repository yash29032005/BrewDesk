import React, { useContext } from "react";
import { MdDashboard } from "react-icons/md";
import { ProductContext } from "../../context/ProductContext";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ManagerDashboard = () => {
  const { products, totalProducts } = useContext(ProductContext);
  const { employees, totalEmployees } = useContext(UserContext);
  const { ordersMap, totalOrder } = useContext(OrderContext);

  const employeeOrdersData = employees
    .map((emp) => ({
      name: emp.emp_name,
      value: Number(ordersMap[emp.emp_id]) || 0,
    }))
    .filter((item) => item.value > 0);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#00c49f"];

  return (
    <div className="px-4 py-2 bg-lightprimary dark:bg-darkprimary min-h-screen">
      <div className="bg-lightsecondary dark:bg-darksecondary p-5 rounded-2xl shadow-xl h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-2xl text-black dark:text-white font-bold">
            <MdDashboard className="text-black dark:text-white" />
            Manager's Dashboard
          </div>
          <Link
            to={"/manager"}
            className="text-black dark:text-white px-4 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary rounded-2xl"
          >
            Go Back
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-5 grid-rows-3 gap-4 h-full text-black dark:text-white">
          {/* Orders Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6 "
          >
            <div className="text-4xl font-extrabold">{totalOrder}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Orders
            </div>
          </div>

          {/* Employees Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl font-extrabold">{totalEmployees}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Employees
            </div>
          </div>

          {/* Another Stat Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl font-extrabold">{totalProducts}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Products
            </div>
          </div>

          {/* Product Stock Chart */}
          <div
            className="flex flex-col font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          col-span-2 row-span-3 rounded-2xl p-5 shadow-lg"
          >
            <div className="text-xl font-extrabold mb-4 border-b border-lightgrey dark:border-darkgrey pb-2">
              Product Stock Levels
            </div>
            <div className="w-full h-full">
              <ResponsiveContainer>
                <BarChart data={products}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="product_name"
                    tick={{ fontSize: 12, fill: "#fff" }}
                  />

                  <YAxis tick={{ fontSize: 12, fill: "#fff" }} />

                  <Tooltip
                    labelStyle={{ color: "#000" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                    }}
                  />

                  <Bar dataKey="product_stock">
                    {products.map((pro, index) => (
                      <Cell
                        key={index}
                        fill={pro.product_stock <= 5 ? "#ef4444" : "#22c55e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Orders Pie Chart */}
          <div
            className="flex flex-col font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          col-span-3 row-span-2 rounded-2xl p-5 shadow-lg"
          >
            <div className="text-xl font-extrabold mb-4 border-b border-lightgrey dark:border-darkgrey pb-2">
              Orders by Employees
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeOrdersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {employeeOrdersData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
