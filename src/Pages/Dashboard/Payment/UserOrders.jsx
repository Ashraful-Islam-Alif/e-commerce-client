import React, { useState, useEffect } from "react";
import { FaEye, FaDownload, FaShoppingBag } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";

const UserOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosSecure.get(`/orders?email=${user.email}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "processing":
        return "badge-info";
      case "shipped":
        return "badge-primary";
      case "delivered":
        return "badge-success";
      case "cancelled":
      case "failed":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const generatePDFInvoice = (order) => {
    try {
      const doc = new jsPDF();

      // Helper function to format currency properly
      const formatCurrency = (amount) => {
        const numAmount =
          typeof amount === "string" ? parseFloat(amount) : amount;
        return `Tk ${numAmount.toFixed(2)}`;
      };

      // Set up page margins and dimensions
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - margin * 2;

      // Header with company name
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("GRIPS & GEARS", margin, 30);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Motorcycle Parts & Accessories", margin, 40);

      // Invoice title
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("INVOICE", 150, 30);

      // Invoice details box - improved positioning
      const boxX = 140;
      const boxY = 35;
      const boxWidth = 60;
      const boxHeight = 25;

      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(250, 250, 250);
      doc.rect(boxX, boxY, boxWidth, boxHeight, "FD");

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(
        `Invoice #: ${order.transactionId.substring(0, 12)}`,
        boxX + 5,
        boxY + 8
      );
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        boxX + 5,
        boxY + 16
      );

      // Customer Information
      let yPos = 75;
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Bill To:", margin, yPos);

      doc.setFontSize(10);
      yPos += 8;
      doc.text(order.customerInfo.name, margin, yPos);
      yPos += 6;
      doc.text(order.customerInfo.address, margin, yPos);

      if (order.customerInfo.address2) {
        yPos += 6;
        doc.text(order.customerInfo.address2, margin, yPos);
      }

      yPos += 6;
      doc.text(
        `${order.customerInfo.city}, ${order.customerInfo.postcode}`,
        margin,
        yPos
      );

      if (order.customerInfo.state) {
        yPos += 6;
        doc.text(order.customerInfo.state, margin, yPos);
      }

      yPos += 6;
      doc.text(order.customerInfo.country || "Bangladesh", margin, yPos);
      yPos += 6;
      doc.text(`Phone: ${order.customerInfo.phone}`, margin, yPos);
      yPos += 6;
      doc.text(`Email: ${order.email}`, margin, yPos);

      // Order Information (right side)
      let rightYPos = 75;
      doc.setFontSize(12);
      doc.text("Order Information:", 120, rightYPos);
      doc.setFontSize(10);
      rightYPos += 8;
      doc.text(`Order ID: ${order.transactionId}`, 120, rightYPos);
      rightYPos += 6;
      doc.text(
        `Payment Status: ${order.paymentStatus.toUpperCase()}`,
        120,
        rightYPos
      );
      rightYPos += 6;
      doc.text(`Order Status: ${order.status.toUpperCase()}`, 120, rightYPos);
      rightYPos += 6;
      doc.text("Payment Method: SSL Commerz", 120, rightYPos);

      // Items table with improved layout
      yPos = Math.max(yPos, rightYPos) + 20;

      // Table dimensions
      const tableX = margin;
      const tableWidth = 170;
      const colWidths = {
        item: tableWidth * 0.45, // 45% for item name
        qty: tableWidth * 0.15, // 15% for quantity
        price: tableWidth * 0.2, // 20% for unit price
        total: tableWidth * 0.2, // 20% for total
      };

      // Table header with better alignment
      doc.setFillColor(240, 240, 240);
      doc.rect(tableX, yPos, tableWidth, 8, "F");

      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text("Item", tableX + 5, yPos + 6);

      // Center-align headers
      const qtyHeaderX = tableX + colWidths.item + colWidths.qty / 2;
      const priceHeaderX =
        tableX + colWidths.item + colWidths.qty + colWidths.price / 2;
      const totalHeaderX =
        tableX +
        colWidths.item +
        colWidths.qty +
        colWidths.price +
        colWidths.total / 2;

      doc.text("Qty", qtyHeaderX, yPos + 6, { align: "center" });
      doc.text("Price", priceHeaderX, yPos + 6, { align: "center" });
      doc.text("Total", totalHeaderX, yPos + 6, { align: "center" });

      // Table content with proper alignment
      yPos += 12;
      let subtotal = 0;

      order.cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Alternate row background
        doc.setFillColor(index % 2 === 0 ? 255 : 250, 250, 250);
        doc.rect(tableX, yPos - 2, tableWidth, 8, "F");

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        // Item name - truncate if too long
        const itemName =
          item.name.length > 35
            ? item.name.substring(0, 32) + "..."
            : item.name;
        doc.text(itemName, tableX + 5, yPos + 4);

        // Quantity - centered
        const qtyX = tableX + colWidths.item + colWidths.qty / 2;
        doc.text(item.quantity.toString(), qtyX, yPos + 4, { align: "center" });

        // Unit price - centered
        const priceX =
          tableX + colWidths.item + colWidths.qty + colWidths.price / 2;
        doc.text(formatCurrency(item.price), priceX, yPos + 4, {
          align: "center",
        });

        // Total - centered
        const totalX =
          tableX +
          colWidths.item +
          colWidths.qty +
          colWidths.price +
          colWidths.total / 2;
        doc.text(formatCurrency(itemTotal), totalX, yPos + 4, {
          align: "center",
        });

        yPos += 10;
      });

      // Total section with improved alignment
      yPos += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(120, yPos, 190, yPos);

      // Calculate positions for totals alignment
      const totalsLabelX = 120;
      const totalsValueX =
        tableX +
        colWidths.item +
        colWidths.qty +
        colWidths.price +
        colWidths.total / 2;

      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Subtotal:", totalsLabelX, yPos);
      doc.text(formatCurrency(subtotal), totalsValueX, yPos, {
        align: "center",
      });

      // Check if there are gateway fees
      if (order.paymentDetails && order.paymentDetails.gateway_fees) {
        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Gateway Fees:", totalsLabelX, yPos);
        doc.text(
          formatCurrency(order.paymentDetails.gateway_fees),
          totalsValueX,
          yPos,
          { align: "center" }
        );

        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text("Total Paid:", totalsLabelX, yPos);
        doc.text(
          formatCurrency(
            order.paymentDetails.total_paid_by_customer || order.totalAmount
          ),
          totalsValueX,
          yPos,
          { align: "center" }
        );
      } else {
        yPos += 8;
        doc.setFontSize(12);
        doc.text("Total:", totalsLabelX, yPos);
        doc.text(formatCurrency(order.totalAmount), totalsValueX, yPos, {
          align: "center",
        });
      }

      // Footer
      yPos += 25;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for shopping with Grips & Gears!", margin, yPos);
      yPos += 6;
      doc.text(
        "For support, contact us at support@gripsandgears.com",
        margin,
        yPos
      );

      // Add page border
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, 15, 180, 267);

      // Save the PDF
      doc.save(
        `Grips_Gears_Invoice_${order.transactionId.substring(0, 12)}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF invoice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Helmet>
        <title>My Orders - Grips & Gears</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="badge badge-neutral">{orders.length} Orders</div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.transactionId}>
                  <td>
                    <div className="font-mono text-sm">
                      {order.transactionId.substring(0, 20)}...
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {order.cartItems.length} item
                      {order.cartItems.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold">৳{order.totalAmount}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-sm btn-outline btn-primary"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {order.paymentStatus === "paid" && (
                        <button
                          onClick={() => generatePDFInvoice(order)}
                          className="btn btn-sm btn-outline btn-secondary"
                          title="Download PDF Invoice"
                        >
                          <FaDownload />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Order Details</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.transactionId}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ৳{selectedOrder.totalAmount}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className={`badge ml-2 ${
                        selectedOrder.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Order Status:</strong>
                    <span
                      className={`badge ml-2 ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <div className="text-sm">
                  <p>{selectedOrder.customerInfo.name}</p>
                  <p>{selectedOrder.customerInfo.address}</p>
                  {selectedOrder.customerInfo.address2 && (
                    <p>{selectedOrder.customerInfo.address2}</p>
                  )}
                  <p>
                    {selectedOrder.customerInfo.city},{" "}
                    {selectedOrder.customerInfo.postcode}
                  </p>
                  {selectedOrder.customerInfo.state && (
                    <p>{selectedOrder.customerInfo.state}</p>
                  )}
                  <p>{selectedOrder.customerInfo.country}</p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td>৳{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>৳{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-action">
              {selectedOrder.paymentStatus === "paid" && (
                <button
                  onClick={() => generatePDFInvoice(selectedOrder)}
                  className="btn btn-primary"
                >
                  <FaDownload className="mr-2" />
                  Download PDF Invoice
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
