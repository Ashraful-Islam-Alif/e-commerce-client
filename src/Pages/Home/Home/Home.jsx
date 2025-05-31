import { useOutletContext } from "react-router-dom";
import Helmets from "../../Products/Helmets/Helmets";
import Banner from "./Banner/Banner";

const Home = () => {
  const { addToCart } = useOutletContext();
  return (
    <div>
      <Banner></Banner>
      <Helmets addToCart={addToCart}></Helmets>
    </div>
  );
};

export default Home;
