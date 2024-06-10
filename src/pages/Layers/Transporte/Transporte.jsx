import { FaRoad, FaTrain, FaSubway, FaTram, FaBus, FaBusAlt, FaTaxi, FaParking} from "react-icons/fa";
import { MdDirectionsBike, MdElectricBike  } from "react-icons/md";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import "../../../styles/Layers/Transporte/transporte.css"
import { useContext } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";


const Transporte = ({onBack, color}) => {
  const {toggleLayer} = useContext(MapLayerContext);

  const itemsTransporte = [
    {
      id: 1,
      nombre: "Vías de Circulación",
      icono: <FaRoad/>,
      layerProps: null
    },
    {
      id: 2,
      nombre:"Red de Ferrocarril",
      icono: <FaTrain/> ,
      layerProps: null
    },
    {
      id: 3,
      nombre:"Estaciones de Ferrocarril",
      icono: <FaTrain/> ,
      layerProps: null
    },
    {
      id: 4,
      nombre:"Red de Subte",
      icono: <FaTram/>,
      layerProps:null
    },
    {
      id: 5,
      nombre:"Red de Premetro",
      icono: <FaSubway/>,
      layerProps: null
    },
    {
      id: 6,
      nombre:"Estaciones de Premetro",
      icono: <FaSubway/>,
      layerProps: null
    },
    {
      id: 7,
      nombre:"Red de Metrobús",
      icono: <FaBus/> ,
      layerProps: null
    },
    {
      id: 8,
      nombre:"Estaciones de Metrobús",
      icono: <FaBus/> ,
      layerProps: null
    },
    {
      id: 9,
      nombre:"Ciclovías",
      icono: <MdDirectionsBike/>,
      layerProps: null
    },
    {
      id: 10,
      nombre:"Estaciones Ecobici",
      icono: <MdElectricBike/> ,
      layerProps: null
    },
    {
      id: 11,
      nombre:"Paradas de Colectivo",
      icono: <FaBusAlt/> ,
      layerProps: null
    },
    {
      id: 12,
      nombre:"Paradas de Taxi",
      icono: <FaTaxi/>,
      layerProps: null
    },
    {
      id: 13,
      nombre:"Estacionamiento de bicis",
      icono: <FaParking/>,
      layerProps: null
    },
    {
      id: 14,
      nombre:"Estacionamiento permitido",
      icono: <FaParking/> ,
      layerProps: null
    },
    {
      id: 15,
      nombre:"Cortes de tránsito",
      icono: <BiSolidTrafficBarrier/>,
      layerProps: null
    },
  ];

  const handleToggleLayer = (layer) => {
    toggleLayer(layer)
  };

  return (
    <div>
      <div className='d-flex m-0 p-2 justify-content-between align-items-center' style={{backgroundColor: `${color}`}}>
        <div className='fs-4'>Transporte</div>
        <button onClick={onBack} className='btn btn-transparent'>X</button>
      </div>
        <ul className="m-0 p-0">
          {
            itemsTransporte.map((item) => {
              return (
                <li
                  className="d-flex gap-2 m-1 p-1 align-items-center list-item"
                  key={item.id}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.nombre}
                  onClick={item.layerProps?()=>{handleToggleLayer(item.layerProps)}:null}
                  >
                  <input type="checkbox"/>
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

export default Transporte