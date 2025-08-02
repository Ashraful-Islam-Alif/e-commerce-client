import { useEffect, useState } from "react";

const useTyre = () => {
  const [tyres, seTyre] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/tyre")
      .then((res) => res.json())
      .then((data) => {
        const tyreWithId = data.map((item, index) => ({
          id: item._id || index, //fallback to index if no ID
          ...item,
        }));
        seTyre(tyreWithId);
        setLoading(false);
      });
  });
  return [tyres, loading];
};

export default useTyre;
