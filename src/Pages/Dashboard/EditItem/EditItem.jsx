import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (state?.product) {
      reset(state.product);
      setFetching(false);
    } else {
      axiosSecure
        .get(`/allproducts/${id}`)
        .then((res) => {
          console.log(res);
          reset(res.data);
        })
        .catch(() => {
          Swal.fire("Error", "Product not found", "error");
        })
        .finally(() => setFetching(false));
    }
  }, [id, axiosSecure, reset, state]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = data.image;

      if (data.newImage && data.newImage[0]) {
        const imageFile = { image: data.newImage[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "content-type": "multipart/form-data" },
        });
        if (res.data.success) {
          imageUrl = res.data.data.display_url;
        }
      }

      const updatedProduct = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        details: data.details,
        image: imageUrl,
      };

      await axiosSecure.put(`/allproducts/${id}`, updatedProduct);
      await axiosSecure.put(
        `/${data.category.toLowerCase()}/${id}`,
        updatedProduct
      );

      Swal.fire({
        icon: "success",
        title: "Product updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard/manageitems");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Update failed", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center mt-10">Loading product data...</p>;
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name*
            </label>
            <input
              {...register("name")}
              placeholder="Product Name"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category*
            </label>
            <select
              {...register("category")}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
            >
              <option value="Helmet">Helmet</option>
              <option value="Tyre">Tyre</option>
              <option value="SpareParts">Spare Parts</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price*
            </label>
            <input
              {...register("price")}
              type="number"
              placeholder="Price"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Details*
            </label>
            <textarea
              {...register("details")}
              placeholder="Details"
              className="textarea textarea-bordered w-full"
              rows="5"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Image*
            </label>
            {watch("image") && (
              <div className="mb-3">
                <img
                  src={watch("image")}
                  alt="Current Product"
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              {...register("newImage")}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
