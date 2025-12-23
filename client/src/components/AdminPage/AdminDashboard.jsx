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

const AdminDashboard = () => {
  const { products, totalProducts } = useContext(ProductContext);
  const { employees, totalEmployees, totalManagers, totalAdmin } =
    useContext(UserContext);
  const { ordersMap, totalOrder, totalRevenue, allOrders } =
    useContext(OrderContext);

  const employeeOrdersData = employees.map((emp) => ({
    name: emp.emp_name,
    value: ordersMap[emp.emp_id] ?? 0,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#00c49f"];

  return (
    <div className="px-4 py-2 bg-lightprimary dark:bg-darkprimary min-h-screen">
      <div className="bg-lightsecondary dark:bg-darksecondary p-5 rounded-2xl shadow-xl h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-2xl text-black dark:text-white font-bold">
            <MdDashboard className="text-black dark:text-white" />
            Admin's Dashboard
          </div>
          <Link
            to={"/admin"}
            className="text-black dark:text-white px-4 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary rounded-2xl"
          >
            Go Back
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-5 grid-rows-5 gap-4 h-full text-black dark:text-white">
          {/* Orders Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6 "
          >
            <div className="text-4xl font-extrabold">₹{totalRevenue}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Revenue
            </div>
          </div>

          {/* Employees Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl font-extrabold">{totalOrder}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Orders
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
                <BarChart
                  data={products} // extra space for labels
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fill: "#fff",
                    }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#fff" }} />
                  <Tooltip
                    labelStyle={{ color: "#000" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="stock">
                    {products.map((pro) => (
                      <Cell
                        key={pro.id}
                        fill={pro.stock <= 5 ? "#ef4444" : "#22c55e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Card */}
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

          {/* Employees Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl font-extrabold">{totalManagers}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Manager
            </div>
          </div>

          {/* Another Stat Card */}
          <div
            className="flex flex-col justify-center items-center text-center font-bold 
                          bg-gradient-to-b from-lightternary to-lightprimary 
                          dark:from-darkternary dark:to-darkprimary 
                          rounded-2xl shadow-lg p-6"
          >
            <div className="text-4xl font-extrabold">{totalAdmin}</div>
            <div className="text-lightgrey dark:text-darkgrey text-sm">
              Admin
            </div>
          </div>

          {/* Employee Orders Pie Chart */}
          <div
            className="flex flex-col font-bold  
            bg-gradient-to-b from-lightternary to-lightprimary 
            dark:from-darkternary dark:to-darkprimary 
            col-span-3 row-span-3 rounded-2xl p-5 shadow-lg
            max-h-[600px] overflow-y-auto"
          >
            <div className="text-xl font-extrabold mb-4 border-b border-lightgrey dark:border-darkgrey pb-2">
              Recent Orders
            </div>

            {/* Orders List */}
            {allOrders.length === 0 ? (
              <p className="text-lightgrey dark:text-darkgrey">
                No orders found
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {allOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="rounded-lg p-4 bg-gradient-to-b from-lightternary to-lightprimary
          dark:bg-gradient-to-b dark:from-darkternary dark:to-darkprimary shadow-md"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm text-lightgrey dark:text-darkgrey">
                          <span className="font-bold">#{order.orderId}</span> |{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-black dark:text-white mt-1">
                          Customer Name:{" "}
                          <span className="font-bold">
                            {order.customerName}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-black dark:text-white text-sm">
                          <th className="pb-2">Item</th>
                          <th className="pb-2">Qty</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr
                            key={i}
                            className="text-lightgrey dark:text-darkgrey text-sm border-t 
                  border-darkgrey dark:border-lightgrey"
                          >
                            <td className="py-2">{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Order Total */}
                    <div className="flex justify-end mt-1 pt-3 border-t border-darkgrey dark:border-lightgrey font-semibold text-gray-900 dark:text-white">
                      Order Total: ₹{order.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Employee Orders Pie Chart */}
          <div
            className="flex flex-col font-bold 
                  bg-gradient-to-b from-lightternary to-lightprimary 
                  dark:from-darkternary dark:to-darkprimary 
                  col-span-2 row-span-2 rounded-2xl p-5 shadow-lg"
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
                  fill="#8884d8"
                  label
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

export default AdminDashboard;
