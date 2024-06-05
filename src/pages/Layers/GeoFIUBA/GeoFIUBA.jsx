import { FaHouse, FaPeopleGroup, FaPeopleRoof, FaTrain  } from "react-icons/fa6";
import { TiThLargeOutline } from "react-icons/ti";
import { BsFillHousesFill } from "react-icons/bs";
import { PiParkDuotone } from "react-icons/pi";
import { BsBank } from "react-icons/bs";
import { IoIosRadioButtonOff } from "react-icons/io";
import { GiPlantRoots } from "react-icons/gi";
import { useContext } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";

const GeoFIUBA = ({onBack, color}) => {
  const URL = "http://geo.fi.uba.ar/geoserver/ows?"
  const {toggleLayer} = useContext(MapLayerContext);
  const itemsGeoFIUBA = [
    {
      id: 1,
      nombre:"Líneas de Ferrocarril",
      icono: <FaTrain/>,
      layerProps:{
        name: 'transporte_lineas:linea_ferrocaril_argentina',
        url: URL,
        layers: 'transporte_lineas:ARG_activos_lineales_2022',
        attribution: '&copy; attribution'
    }
    },
    {
      id: 2,
      nombre:"Estaciones de Ferrocarril",
      icono: <FaTrain/>,
      layerProps:{
        name: 'transporte_estacion:ARG_estaciones_2022',
        url: URL,
        layers: 'transporte_estacion:ARG_estaciones_2022',
        attribution: '&copy; attribution'
    }
    },
    // {
    //   id: 3,
    //   nombre:"Estaciones de Ferrocarril",
    //   icono: <FaTrain/>,
    //   layerProps:{
    //     name: 'estaciones_argentina',
    //     url: 'http://geo.fi.uba.ar/geoserver/wms?version=1.3.0',
    //     layers: 'transporte_estacion:estaciones_argentina',
    //     attribution: '&copy; attribution'
    // }
    // },
    // {
    //   id: 4,
    //   nombre:"Estaciones de Ferrocarril",
    //   icono: <FaTrain/>,
    //   layerProps:{
    //     name: 'estaciones_argentina',
    //     url: 'http://geo.fi.uba.ar/geoserver/wms?version=1.3.0',
    //     layers: 'transporte_estacion:estaciones_argentina',
    //     attribution: '&copy; attribution'
    // }
    // }
  ]

  const handleToggleLayer = (layer) => {
    toggleLayer(layer)
  };


  return (
    <div>
      <div className='d-flex m-0 p-2 justify-content-between align-items-center' style={{backgroundColor: `${color}`}}>
          <div className='fs-4'>GeoFIUBA</div>
          <button onClick={onBack} className='btn btn-transparent'>X</button>
      </div>
      <ul className="m-0 p-0">
          {
            itemsGeoFIUBA.map((item) => {
              return (
                <li
                  className="d-flex gap-2 m-1 p-1 align-items-center list-item"
                  key={item.id}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.nombre}
                  onClick={item.layerProps?()=>{handleToggleLayer(item.layerProps)}:null}
                  >
                  {item.icono}
                  <p className="m-0">{item.nombre}</p>
                </li>
              )
            })
          }
        </ul>
    </div>
  )
}

export default GeoFIUBA