import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { Helmet } from "react-helmet-async";
const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const { createUser, googleSignIn } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const onSubmit = (data) => {
    console.log("SignUp Data:", data);
    createUser(data.email, data.password).then((result) => {
      const loggedUser = result.user;
      console.log(loggedUser);
      reset();
      navigate("/login");
    });
  };
  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        const googleUser = result.user;
        console.log("Google Sign-In Successfully:", googleUser);
        navigate("/");
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-lg rounded-xl mt-10 bg-white">
      <Helmet>
        <title>Grips&Gears | SignUp</title>
      </Helmet>
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            aria-invalid={errors.password ? "true" : "false"}
          />
          <span
            className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer text-gray-500"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-2">
        <small>
          Already have Account? <Link to="/login">Login</Link>
        </small>
      </p>
      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <FcGoogle size={24} /> <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
