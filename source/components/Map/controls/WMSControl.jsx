import CustomButtonControl from "./CustomButtonControl";
import { useMap } from "react-leaflet";


const WMSControl = ({handleClick}) => {
  const map = useMap();

  return (
    <CustomButtonControl
      onClick={handleClick}
      iconClassName="wms-control-button"
      postion={"topright"}
      title={"Capas Temporales"}
      className={"leaflet-layers-control"}
      anchorStyle={{"width":"44px", "height":"44px"}}
    />
  );
};

export default WMSControl;
