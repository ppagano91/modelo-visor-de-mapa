import L from "leaflet";
import CustomButtonControl from "./CustomButtonControl";
import { useMap } from "react-leaflet";
import View from "../../../assets/images/mundo.png";

const InitialView = () => {
  const map = useMap();
  const handleClick = () => {
    map.setView([-34.599722, -58.381944], 15);
  };

  return (
    <CustomButtonControl
      // innerHTML="🌐"
      onClick={handleClick}
      // iconImage={View}
      iconClassName="initial-view-button"
    />
  );
};

export default InitialView;
