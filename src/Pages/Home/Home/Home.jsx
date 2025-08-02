import Helmets from "../../Products/Helmets/Helmets";
import Tyres from "../../Products/Tyres/Tyres";
import Banner from "./Banner/Banner";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Helmets></Helmets>
      <Tyres></Tyres>
    </div>
  );
};

export default Home;
