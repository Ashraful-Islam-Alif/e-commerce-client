import { useEffect, useState } from "react";

const useSpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/spareParts")
      .then((res) => res.json())
      .then((data) => {
        const sparePartsWithId = data.map((item, index) => ({
          id: item.id || item._id || index, // fallback to index if no ID
          ...item,
        }));
        setSpareParts(sparePartsWithId);
        setLoading(false);
      });
  });
  return [spareParts, loading];
};

export default useSpareParts;
