import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useLoading from "../../../hooks/useLoading";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageItems = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    resetError,
  } = useLoading();

  const {
    data: allproducts = [],
    refetch,
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["allproducts"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/allproducts");
        return res.data;
      } catch (error) {
        throw new Error("Failed to fetch products");
      }
    },
  });

  const handleEditProduct = (product) => {
    navigate(`/dashboard/editItem/${product._id}`);
    console.log("edit product send:", product);
  };

  const handleDeleteProduct = async (product) => {
    resetError();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        startLoading();

        try {
          console.log(`Deleting product with ID: ${product._id}`);

          // First verify the product still exists
          try {
            const allProducts = await axiosSecure.get("/allproducts");
            const productExists = allProducts.data.find(
              (p) => p._id === product._id
            );

            if (!productExists) {
              throw new Error(
                "Product no longer exists. The page data might be outdated. Please refresh the page."
              );
            }

            console.log("Product confirmed to exist:", productExists.name);
          } catch (checkError) {
            if (checkError.message.includes("no longer exists")) {
              throw checkError;
            }
            console.warn("Could not verify product existence:", checkError);
          }

          const res = await axiosSecure.delete(`/allproducts/${product._id}`);
          console.log("Delete response:", res.data);

          if (res.data.deletedCount > 0) {
            if (product.category) {
              const categoryEndPoint = `/${product.category.toLowerCase()}/${
                product._id
              }`;
              console.log(
                `Deleting from category endpoint: ${categoryEndPoint}`
              );

              try {
                const categoryRes = await axiosSecure.delete(categoryEndPoint);
                console.log("Category deletion result:", categoryRes.data);
              } catch (categoryError) {
                console.warn(
                  "Category deletion failed (might not exist):",
                  categoryError.response?.data || categoryError.message
                );
              }
            }

            await refetch();
            stopLoading();

            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            throw new Error("Product not found or already deleted");
          }
        } catch (error) {
          stopLoading();

          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete product. Please try again.";

          setErrorState(errorMessage);

          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>Grips & Gears | Manage Items</title>
      </Helmet>

      <h3 className="text-3xl font-bold my-4">
        Total Products: {allproducts.length}
      </h3>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SL</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allproducts.map((allproduct, index) => (
              <tr key={allproduct._id}>
                <th>{index + 1}</th>
                <td>
                  <img
                    src={allproduct.image}
                    alt={allproduct.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/64x64?text=No+Image";
                    }}
                  />
                </td>
                <td>{allproduct.name}</td>
                <td>{allproduct?.category}</td>
                <td>
                  {allproduct.role === "admin" ? (
                    "Admin"
                  ) : (
                    <button
                      onClick={() => handleEditProduct(allproduct)}
                      className="btn btn-warning text-white"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteProduct(allproduct)}
                    className="btn btn-sm btn-error text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">Deleting product...</p>
            <p className="text-sm text-gray-600">Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
