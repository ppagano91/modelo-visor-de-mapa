import { useContext } from "react";
import { MapLayerContext } from "../context/MapLayerContext";
import {Info} from "@mui/icons-material";

const MasInformacion = () => {
  const {info} = useContext(MapLayerContext);
  console.log(info);
  return (
    <div className="masinfo-wrapper">
        {Object.keys(info).length === 0 ?
          <div className="d-flex flex-column justify-content-center align-items-center p-2 h-100" style={{width: "21rem", position: "relative"}} >
        
            <Info className="m-2"/>
            <p className="text-justify p-2 masinfo-texto">
              Puede acceder a <b>información contextual</b> haciendo "<i>click</i> derecho" sobre un punto del mapa.
            </p>
          </div>
        :
        <div className="d-flex flex-column p-3 h-100" style={{width: "21rem", position: "relative"}} >
          <div className="">
            <h3>Información</h3>
            {Object.keys(info).map((key) => (
              <>
                <div key={key} className="d-flex justify-content-between">
                  <p className="p-0 m-1">
                    <b>{key}</b>:
                  </p>
                  <p>
                    {info[key]}
                  </p>
                </div>
                <hr className="p-0 m-0"/>
              </>              
            ))}
          </div>
        </div>
        }
      </div>
  )
}

export default MasInformacion