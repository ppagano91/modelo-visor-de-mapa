import { FaHospital, FaHospitalSymbol, FaHospitalUser } from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineLocalPharmacy, MdOutlineHealthAndSafety } from "react-icons/md";
import { RiHospitalLine } from "react-icons/ri";
import { TbVaccine } from "react-icons/tb";


const Salud = ({ onBack, color }) => {
  const itemsSalud = [
    {
        id: 1,
        icono: <FaHospital/>,
        nombre: "Hospitales GCABA",
        layerProps: null
    },
    {
        id: 2,
        icono: <MdHealthAndSafety/>,
        nombre: "Centros de Salud Nivel 1 (CeSAC)",
        layerProps: null
    },
    {
        id: 3,
        icono: <MdOutlineHealthAndSafety/>,
        nombre: "Centros Médicos Barriales",
        layerProps: null
    },
    {
        id: 4,
        icono: <RiHospitalLine/>,
        nombre: "Otros Centros de Salud GCABA",
        layerProps: null
    },
    {
        id: 5,
        icono: <RiHospitalLine/>,
        nombre: "Centros de Salud no dependientes del GCABA",
        layerProps: null
    },
    {
        id: 6,
        icono: <FaHospitalUser/>,
        nombre: "Estaciones Saludables",
        layerProps: null
    },
    {
        id: 7,
        icono: <MdOutlineLocalPharmacy/>,
        nombre: "Farmacias",
        layerProps: null
    },
    {
        id: 8,
        icono: <FaHospitalSymbol/>,
        nombre: "Áreas Hospitalarias",
        layerProps: null
    },
    {
        id: 9,
        icono: <TbVaccine/>,
        nombre: "Vacunatorios",
        layerProps: null
    }
]

  return (
        <div className=''>
          <div className='d-flex m-0 p-2 justify-content-between align-items-center' style={{backgroundColor: `${color}`}}>
            <div className='fs-4'>Salud</div>
            <button onClick={onBack} className='btn btn-transparent'>X</button>
          </div>
          <ul className="m-0 p-0">
          {
            itemsSalud.map((item) => {
              return (
                <li
                  className="d-flex gap-2 m-1 p-1 align-items-center list-item"
                  key={item.id}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={item.nombre}
                  onClick={item.layerProps?null:null}
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

export default Salud