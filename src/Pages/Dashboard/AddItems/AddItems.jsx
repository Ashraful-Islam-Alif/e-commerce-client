import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItems = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    console.log(data);

    //image upload to imgbb and then get an url
    const imageFile = { image: data.image[0] };
    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      const productItems = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        details: data.details,
        image: res.data.data.display_url,
      };

      // Determine the endpoint based on category
      let endpoint = "";
      switch (data.category.toLowerCase()) {
        case "helmet":
          endpoint = "/helmet";
          break;
        case "tyre":
          endpoint = "/tyre";
          break;
        case "spareparts":
          endpoint = "/spareparts";
          break;
        default:
          console.error("Invalid category selected");
          return;
      }

      const productRes = await axiosSecure.post(endpoint, productItems);
      console.log(productRes.data);
      if (productRes.data.insertedId) {
        const allProductsItem = {
          ...productItems,
          _id: productRes.data.insertedId,
        };
        await axiosSecure.post("/allproducts", allProductsItem);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} is added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    console.log(res.data);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name*
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Product Name is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category*
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Helmet">Helmet</option>
              <option value="Tyre">Tyre</option>
              <option value="SpareParts">Spare Parts</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price*
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Product Details */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Details*
            </label>
            <textarea
              {...register("details", { required: "Details are required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Enter product details"
              rows="3"
            ></textarea>
            {errors.details && (
              <p className="text-red-500 text-sm mt-1">
                {errors.details.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Product Image*
            </label>
            <input
              {...register("image", { required: "Image is required" })}
              type="file"
              accept="image/*"
              className="block w-full text-gray-700 border rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500  text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
