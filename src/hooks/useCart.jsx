import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useCart = () => {
  //tanstack query
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useContext(AuthContext);
  const {
    data: cart = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?email=${user.email}`);
      return res.data;
    },
  });

  // Increase quantity
  const increaseQty = async (id, currentQty) => {
    await axiosSecure.patch(`/carts/${id}`, { quantity: currentQty + 1 });
    refetch();
  };

  // Decrease quantity
  const decreaseQty = async (id, currentQty) => {
    if (currentQty > 1) {
      await axiosSecure.patch(`/carts/${id}`, { quantity: currentQty - 1 });
      refetch();
    }
  };

  // Delete item
  const removeItem = async (id) => {
    await axiosSecure.delete(`/carts/${id}`);
    refetch();
  };

  return [
    cart,
    refetch,
    isLoading,
    isError,
    error,
    increaseQty,
    decreaseQty,
    removeItem,
  ];
};

export default useCart;
