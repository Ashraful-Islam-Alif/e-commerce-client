import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Payment Error - Grips & Gears</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl text-red-500 mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Error
          </h1>
          <p className="text-gray-600 mb-6">
            An unexpected error occurred during the payment process. Please try
            again later.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/myItems")}
              className="btn btn-primary"
            >
              Return to Cart
            </button>
            <button onClick={() => navigate("/")} className="btn btn-outline">
              Go Home
            </button>
          </div>

          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>Error Code:</strong> PAYMENT_PROCESSING_ERROR
              <br />
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
