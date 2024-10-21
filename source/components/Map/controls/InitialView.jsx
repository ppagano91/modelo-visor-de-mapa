import CustomButtonControl from "./CustomButtonControl";
import { useMap } from "react-leaflet";
import { getEnv } from "../../../config";

const InitialView = () => {
  const centerCoords=getEnv("VITE_CENTRO_CABA").split(",")
  const map = useMap();
  const handleClick = () => {
    map.setView([centerCoords[0], centerCoords[1]], 12);
  };

  return (
    <CustomButtonControl
      onClick={handleClick}
      iconClassName="initial-view-button"
      postion={"bottomright"}
      title={"Vista Inicial"}
    />
  );
};

export default InitialView;
