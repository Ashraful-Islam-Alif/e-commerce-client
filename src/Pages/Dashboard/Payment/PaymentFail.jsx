import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

const PaymentFail = () => {
  const { tran_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Payment Failed - Grips & Gears</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl text-red-500 mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but your payment could not be processed. Please try
            again.
          </p>

          {tran_id && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Transaction ID:</strong> {tran_id}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/myItems")}
              className="btn btn-primary"
            >
              Return to Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-outline btn-primary"
            >
              Try Again
            </button>
            <button onClick={() => navigate("/")} className="btn btn-outline">
              Continue Shopping
            </button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Need Help?</strong> If you continue to experience issues,
              please contact our customer support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
