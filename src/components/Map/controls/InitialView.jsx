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
      iconImage={View}
      iconClassName="initial-view-button"
      buttonStyle={{
        width: "2rem",
        height: "2rem",
        border: "2px solid #9EAAB8",
        borderRadius: "5%",
        padding: "2px",
        backgroundColor: "white",
      }}
    />
  );
};

export default InitialView;
