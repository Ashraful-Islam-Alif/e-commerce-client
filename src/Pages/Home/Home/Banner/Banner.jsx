import AwesomeSlider from "react-awesome-slider";
import "./Banner.css";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/custom-animations/cube-animation.css";
import image1 from "./engine-oil-fuel.jpg";
import image2 from "./helmet.jpg";
import image3 from "./Spare-Parts.jpg";
import image4 from "./tyre.png";

const Banner = () => {
  return (
    <div className="relative h-[70vh] sm:h-[60vh] w-full">
      <AwesomeSlider animation="cubeAnimation" className="!h-full !w-full">
        <div className="!h-full !w-full">
          <img
            src={image1}
            alt="Engine Oil"
            className="w-full h-full object-container"
          />
        </div>
        <div className="!h-full !w-full">
          <img
            src={image2}
            alt="Helmet"
            className="w-full h-full object-container"
          />
        </div>
        <div className="!h-full !w-full">
          <img
            src={image3}
            alt="Spare Parts"
            className="w-full h-full object-container"
          />
        </div>
        <div className="!h-full !w-full">
          <img
            src={image4}
            alt="Tyre"
            className="w-full h-full object-container"
          />
        </div>
      </AwesomeSlider>
    </div>
  );
};

export default Banner;
