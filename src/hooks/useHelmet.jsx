import { useEffect, useState } from "react";

const useHelmet = () => {
  const [helmets, setHelmet] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/helmet")
      .then((res) => res.json())
      .then((data) => {
        const helmetWithId = data.map((item, index) => ({
          id: item.id || item._id || index, // fallback to index if no ID
          ...item,
        }));
        setHelmet(helmetWithId);
        setLoading(false);
      });
  });
  return [helmets, loading];
};

export default useHelmet;
