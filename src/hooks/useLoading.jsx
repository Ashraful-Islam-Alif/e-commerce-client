import { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    resetError,
  };
};

export default useLoading;
