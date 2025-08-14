import Helmets from "../../Products/Helmets/Helmets";
import SpareParts from "../../Products/SpareParts/SpareParts";
import Tyres from "../../Products/Tyres/Tyres";
import Banner from "./Banner/Banner";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Helmets></Helmets>
      <Tyres></Tyres>
      <SpareParts></SpareParts>
    </div>
  );
};

export default Home;
