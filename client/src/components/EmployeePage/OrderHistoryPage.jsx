import React, { useContext } from "react";
import { CiClock2 } from "react-icons/ci";
import { OrderContext } from "../../context/OrderContext";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { CiCoffeeCup } from "react-icons/ci";
import { renderToStaticMarkup } from "react-dom/server";

const OrderHistoryPage = () => {
  const { orders, loading } = useContext(OrderContext);

  const generateReceipt = async (order) => {
    if (!order || !Array.isArray(order.items)) {
      console.error("Invalid order object:", order);
      return;
    }

    const doc = new jsPDF();

    const canvasSize = 600; // bigger canvas
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");

    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${renderToStaticMarkup(<CiCoffeeCup size={canvasSize} />)}
        </div>
      </foreignObject>
    </svg>
  `;
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgString);
    await new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
        resolve();
      };
    });

    const imgData = canvas.toDataURL("image/png"); // PNG data URL
    doc.setGState(new doc.GState({ opacity: 0.1 })); // faint
    doc.addImage(imgData, "PNG", -20, 20, 250, 250); // bigger and repositioned
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Header
    doc.setFontSize(18);
    doc.text("Cafe Receipt", 14, 30);
    // Order Info
    doc.setFontSize(12);
    doc.text(`Bill ID: BILL-${order.orderId}`, 14, 42);
    doc.text(`Customer: ${order.customerName}`, 14, 49);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 56);

    // Table Data
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = order.items.map((item) => [
      item.name,
      item.quantity,
      `Rs. ${Number(item.price).toFixed(2)}`,
      `Rs. ${(Number(item.price) * Number(item.quantity)).toFixed(2)}`,
    ]);

    // AutoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      styles: {
        fontSize: 11,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: { halign: "center" },
    });

    // Total amount at the end
    const finalY = doc.lastAutoTable.finalY || 75;
    doc.setFontSize(14);
    doc.text(`Total: Rs. ${Number(order.total).toFixed(2)}`, 14, finalY + 15);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 14, finalY + 25);

    doc.output("dataurlnewwindow");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lightgrey dark:text-darkgrey">Loading orders...</p>
      </div>
    );
  }
  console.log(orders);

  return (
    <div
      className="bg-lightprimary dark:bg-darkprimary p-5 w-full"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* Header */}
      <div className="bg-lightsecondary dark:bg-darksecondary rounded-lg p-5 shadow-md h-full overflow-y-auto">
        <p className="flex items-center gap-2 text-2xl font-semibold text-black dark:text-white mb-6">
          <CiClock2 className="text-xl" />
          Order History
        </p>

        {/* Orders List */}
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order, index) => {
              return (
                <div
                  key={index}
                  className="rounded-lg p-4 bg-gradient-to-b from-lightternary to-lightprimary
                   dark:bg-gradient-to-b dark:from-darkternary dark:to-darkprimary shadow-md relative"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-3 ">
                    <div>
                      <p className="text-sm text-lightgrey dark:text-darkgrey">
                        <span className="font-bold">#{index + 1}</span> |{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-black dark:text-white mt-1">
                        Customer Name:{" "}
                        <span className="font-bold">{order.customerName}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => generateReceipt(order)}
                      className="absolute top-3 right-3 bg-lightprimary dark:bg-darkprimary text-black dark:text-white 
                 py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition font-bold"
                    >
                      View Receipts
                    </button>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
