import { FaHouse, FaPeopleGroup, FaPeopleRoof  } from "react-icons/fa6";
import { TiThLargeOutline } from "react-icons/ti";
import { BsFillHousesFill } from "react-icons/bs";
import { PiParkDuotone } from "react-icons/pi";
import { BsBank } from "react-icons/bs";
import { IoIosRadioButtonOff } from "react-icons/io";
import { GiPlantRoots } from "react-icons/gi";

const Urbanismo = ({onBack, color}) => {
  const itemsUrbanismo = [
    {
      id: 1,
      nombre: "Parcelas",
      icono: <FaHouse/>,
      layerProps: null
    },
    {
      id: 2,
      nombre:"Manzanas",
      icono: <TiThLargeOutline/> ,
      layerProps: null
    },
    {
      id: 3,
      nombre:"Secciones Catastrales",
      icono: <BsFillHousesFill/> ,
      layerProps: null
    },
    {
      id: 4,
      nombre:"Barrios",
      icono: <BsFillHousesFill/>,
      layerProps:null
    },
    {
      id: 5,
      nombre:"Comunas",
      icono: <BsFillHousesFill/>,
      layerProps: null
    },
    {
      id: 6,
      nombre:"Sedes Comunales",
      icono: <BsFillHousesFill/>,
      layerProps: null
    },
    {
      id: 7,
      nombre:"Espacios Verdes",
      icono: <PiParkDuotone/> ,
      layerProps: null
    },
    {
      id: 8,
      nombre:"Código Urbanístico",
      icono: <FaPeopleGroup/> ,
      layerProps: null
    },
    {
      id: 9,
      nombre:"Relevamiento de Usos del Suelo",
      icono: <GiPlantRoots/>,
      layerProps: null
    },
    {
      id: 10,
      nombre:"Radios Censales",
      icono: <IoIosRadioButtonOff/> ,
      layerProps: null
    },
    {
      id: 11,
      nombre:"Población por radio censal",
      icono: <FaPeopleRoof/> ,
      layerProps: null
    },
    {
      id: 12,
      nombre:"Distritos Económicos ",
      icono: <BsBank/>,
      layerProps: null
    }
  ]
  return (
    <div>
      <div className='d-flex m-0 p-2 justify-content-between align-items-center' style={{backgroundColor: `${color}`}}>
          <div className='fs-4'>Urbanismo</div>
          <button onClick={onBack} className='btn btn-transparent'>X</button>
      </div>
      <ul className="m-0 p-0">
          {
            itemsUrbanismo.map((item) => {
              return (
                <li 
                  className="d-flex gap-2 m-1 p-1 align-items-center list-item"
                  key={item.id}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.nombre}
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

export default Urbanismo