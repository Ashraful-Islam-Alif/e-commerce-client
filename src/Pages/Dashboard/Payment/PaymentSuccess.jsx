import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaDownload,
  FaShoppingBag,
  FaSpinner,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";

const PaymentSuccess = () => {
  const { tran_id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        console.log("Fetching order for transaction ID:", tran_id);

        // First try to get the order details
        const response = await axiosSecure.get(`/orders/${tran_id}`);
        console.log("Order response:", response.data);
        setOrder(response.data);

        // If order status is still pending, try to verify payment status
        if (response.data.paymentStatus === "pending") {
          console.log("Order still pending, checking payment status...");
          // Wait a bit for SSL Commerz callback to process
          setTimeout(async () => {
            try {
              const verifyResponse = await axiosSecure.get(
                `/payment/verify/${tran_id}`
              );
              if (verifyResponse.data.paymentStatus === "paid") {
                // Refresh the order data
                const updatedResponse = await axiosSecure.get(
                  `/orders/${tran_id}`
                );
                setOrder(updatedResponse.data);
              }
            } catch (verifyError) {
              console.log("Payment verification check failed:", verifyError);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);

        // Check if it's a 404 (order not found)
        if (error.response?.status === 404) {
          setError(
            "Order not found. The payment may not have been processed correctly."
          );
        } else {
          setError("Failed to load order details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (tran_id) {
      fetchOrder();
    } else {
      setError("Invalid transaction ID");
      setLoading(false);
    }
  }, [tran_id, axiosSecure]);

  const generatePDFInvoice = () => {
    try {
      const doc = new jsPDF();

      // Helper function to format currency properly
      const formatCurrency = (amount) => {
        // Ensure amount is a number and format to 2 decimal places
        const numAmount =
          typeof amount === "string" ? parseFloat(amount) : amount;
        return `Tk ${numAmount.toFixed(2)}`;
      };

      // Helper function to wrap text
      const wrapText = (text, maxWidth) => {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const textWidth =
            (doc.getStringUnitWidth(testLine) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;

          if (textWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines;
      };

      // Set up page margins
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - margin * 2;

      // Header with company name
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.text("GRIPS & GEARS", margin, 30);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Motorcycle Parts & Accessories", margin, 40);

      // Invoice title and details box
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("INVOICE", pageWidth - margin - 50, 30);

      // Invoice details box - better positioned
      const boxX = pageWidth - margin - 70;
      const boxY = 35;
      const boxWidth = 65;
      const boxHeight = 30;

      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(250, 250, 250);
      doc.rect(boxX, boxY, boxWidth, boxHeight, "FD");

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(
        `Invoice #: ${order.transactionId.substring(0, 12)}`,
        boxX + 3,
        boxY + 8
      );
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        boxX + 3,
        boxY + 16
      );
      doc.text(
        `Status: ${order.paymentStatus.toUpperCase()}`,
        boxX + 3,
        boxY + 24
      );

      // Customer Information Section
      let yPos = 80;
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("BILL TO:", margin, yPos);

      // Customer details with better spacing
      doc.setFontSize(11);
      yPos += 10;
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

      // Order Information (right side) - better positioned
      let rightYPos = 80;
      const rightX = pageWidth - margin - 80;
      doc.setFontSize(14);
      doc.text("ORDER INFO:", rightX, rightYPos);

      doc.setFontSize(10);
      rightYPos += 10;
      doc.text(`Order ID:`, rightX, rightYPos);
      doc.text(`${order.transactionId}`, rightX, rightYPos + 4);
      rightYPos += 12;
      doc.text(`Payment Method: SSL Commerz`, rightX, rightYPos);
      rightYPos += 6;
      doc.text(
        `Order Status: ${order.status.toUpperCase()}`,
        rightX,
        rightYPos
      );

      // Items table - improved layout
      yPos = Math.max(yPos, rightYPos) + 25;

      // Table dimensions
      const tableX = margin;
      const tableWidth = contentWidth;
      const colWidths = {
        item: tableWidth * 0.45, // 45% for item name
        qty: tableWidth * 0.15, // 15% for quantity
        price: tableWidth * 0.2, // 20% for unit price
        total: tableWidth * 0.2, // 20% for total
      };

      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(tableX, yPos, tableWidth, 10, "F");

      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text("Item", tableX + 3, yPos + 7);
      doc.text("Qty", tableX + colWidths.item + colWidths.qty / 2, yPos + 7, {
        align: "center",
      });
      doc.text(
        "Unit Price",
        tableX + colWidths.item + colWidths.qty + colWidths.price / 2,
        yPos + 7,
        { align: "center" }
      );
      doc.text(
        "Total",
        tableX +
          colWidths.item +
          colWidths.qty +
          colWidths.price +
          colWidths.total / 2,
        yPos + 7,
        { align: "center" }
      );

      // Table content with proper alignment
      yPos += 12;
      let subtotal = 0;

      order.cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(252, 252, 252);
          doc.rect(tableX, yPos - 2, tableWidth, 10, "F");
        }

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        // Item name - with text wrapping if needed
        const itemName =
          item.name.length > 35
            ? item.name.substring(0, 32) + "..."
            : item.name;
        doc.text(itemName, tableX + 3, yPos + 6);

        // Quantity - centered
        const qtyX = tableX + colWidths.item + colWidths.qty / 2;
        doc.text(item.quantity.toString(), qtyX, yPos + 6, { align: "center" });

        // Unit price - centered
        const priceX =
          tableX + colWidths.item + colWidths.qty + colWidths.price / 2;
        doc.text(formatCurrency(item.price), priceX, yPos + 6, {
          align: "center",
        });

        // Total - centered
        const totalX =
          tableX +
          colWidths.item +
          colWidths.qty +
          colWidths.price +
          colWidths.total / 2;
        doc.text(formatCurrency(itemTotal), totalX, yPos + 6, {
          align: "center",
        });

        yPos += 12;
      });

      // Total section with better alignment
      yPos += 10;

      // Draw line above totals
      doc.setDrawColor(200, 200, 200);
      doc.line(
        tableX + colWidths.item + colWidths.qty,
        yPos - 5,
        tableX + tableWidth,
        yPos - 5
      );

      // Subtotal
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const totalsLabelX = tableX + colWidths.item + colWidths.qty;
      const totalsValueX =
        tableX +
        colWidths.item +
        colWidths.qty +
        colWidths.price +
        colWidths.total / 2;

      doc.text("Subtotal:", totalsLabelX, yPos);
      doc.text(formatCurrency(subtotal), totalsValueX, yPos, {
        align: "center",
      });

      // Gateway fees if applicable
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

        yPos += 12;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("TOTAL PAID:", totalsLabelX, yPos);
        doc.text(
          formatCurrency(
            order.paymentDetails.total_paid_by_customer || order.totalAmount
          ),
          totalsValueX,
          yPos,
          { align: "center" }
        );
      } else {
        yPos += 12;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("TOTAL:", totalsLabelX, yPos);
        doc.text(formatCurrency(order.totalAmount), totalsValueX, yPos, {
          align: "center",
        });
      }

      // Footer section
      yPos += 30;
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Thank you for shopping with Grips & Gears!", margin, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "For support, contact us at support@gripsandgears.com",
        margin,
        yPos
      );
      yPos += 5;
      doc.text("Visit us at www.gripsandgears.com", margin, yPos);

      // Page border
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.height - 20);

      // Save the PDF with proper filename
      const fileName = `Grips_Gears_Invoice_${order.transactionId.substring(
        0,
        12
      )}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF invoice. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <FaSpinner className="text-4xl text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-4xl text-red-500 mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/myItems")}
              className="btn btn-primary w-full"
            >
              Return to Cart
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline w-full"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your order details.
          </p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show pending payment state
  if (order.paymentStatus !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-4xl text-yellow-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-yellow-600 mb-4">
            Payment Pending
          </h2>
          <p className="text-gray-600 mb-2">
            Your payment is still being processed.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Status: <span className="font-semibold">{order.paymentStatus}</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary w-full"
            >
              Refresh Status
            </button>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="btn btn-outline w-full"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Payment Successful - Grips & Gears</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and your
            cart has been cleared.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Order Information
                </h3>
                <p>
                  <strong>Order ID:</strong> {order.transactionId}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ৳{order.totalAmount}
                </p>
                <p>
                  <strong>Payment Status:</strong>
                  <span className="badge badge-success ml-2">
                    {order.paymentStatus}
                  </span>
                </p>
                <p>
                  <strong>Order Status:</strong>
                  <span className="badge badge-info ml-2">{order.status}</span>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Shipping Address
                </h3>
                <p>{order.customerInfo.name}</p>
                <p>{order.customerInfo.address}</p>
                {order.customerInfo.address2 && (
                  <p>{order.customerInfo.address2}</p>
                )}
                <p>
                  {order.customerInfo.city}, {order.customerInfo.postcode}
                </p>
                <p>{order.customerInfo.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-left">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generatePDFInvoice}
              className="btn btn-outline btn-primary"
            >
              <FaDownload className="mr-2" />
              Download PDF Invoice
            </button>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="btn btn-outline btn-secondary"
            >
              View All Orders
            </button>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              <FaShoppingBag className="mr-2" />
              Continue Shopping
            </button>
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>Success!</strong> Your payment has been processed
              successfully. Your order will be processed and shipped within 2-3
              business days. You will receive email updates about your order
              status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
