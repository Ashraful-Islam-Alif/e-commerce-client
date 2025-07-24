import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageItems = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { data: allproducts = [], refetch } = useQuery({
    queryKey: ["allproducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allproducts");
      return res.data;
    },
  });

  const handleEditProduct = (product) => {
    navigate(`/dashboard/editItem/${product._id}`);
  };

  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/allproducts/${product._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            //delete from category collection
            const categoryEndPoint = `/${product.category.toLowerCase()}/${
              product._id
            }`;
            axiosSecure.delete(categoryEndPoint).then(() => {
              refetch();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            });
          }
        });
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
          {/* head */}
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
                      className="btn btn-warning  text-white"
                    >
                      <FaEdit></FaEdit>
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteProduct(allproduct)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
