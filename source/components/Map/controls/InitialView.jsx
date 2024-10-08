import CustomButtonControl from "./CustomButtonControl";
import { useMap } from "react-leaflet";

const InitialView = () => {
  const map = useMap();
  const handleClick = () => {
    map.setView([-34.599722, -58.381944], 12);
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
