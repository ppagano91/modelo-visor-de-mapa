import { useContext } from "react";
import { MapLayerContext } from "../context/MapLayerContext";
import {Info} from "@mui/icons-material";

const MasInformacion = () => {
  const {info} = useContext(MapLayerContext);
  console.log(info);
  return (
    <div className="masinfo-wrapper">
    <div className="d-flex flex-column justify-content-center align-items-center p-2 h-100" style={{width: "21rem", position: "relative"}} >
      {Object.keys(info).length === 0 ?
      <>
        <Info className="m-2"/>
        <p className="text-justify p-2 masinfo-texto">
          Puede acceder a <b>información contextual</b> haciendo "<i>click</i> derecho" sobre un punto del mapa.
        </p>
      </>
      :
      <>
        <div className="">
          {Object.keys(info).map((key) => (
            <div key={key} className="mb-3">
              <h5>{key}</h5>
              <ul className="">
                {Object.keys(info[key]).map((attr) => (
                  attr !== "geometry" && (
                    <li key={attr}>
                      <strong>{attr}:</strong> {info[key][attr]}
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
          </div>
        </>
      }
    </div>
    </div>
  )
}

export default MasInformacion