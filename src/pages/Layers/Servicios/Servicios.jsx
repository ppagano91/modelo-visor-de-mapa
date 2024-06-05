import { FaBriefcase, FaBuilding, FaChurch, FaFireExtinguisher, FaFlag, FaGavel, FaMapMarkedAlt, FaShieldAlt, FaShoppingCart, FaWifi } from "react-icons/fa"

const Servicios = ({onBack, color}) => {
  const itemsServicios = [
    {
        id: 1,
        icono: <FaBuilding/>,
        nombre: "Comisarías Policía de la Ciudad",
        layerProps: null
    },
    {
        id: 2,
        icono: <FaShieldAlt/>,
        nombre: "División Comisarías Vecinales",
        layerProps: null
    },
    {
        id: 3,
        icono: <FaFireExtinguisher/>,
        nombre: "Estaciones de Bomberos",
        layerProps: null
    },
    {
        id: 4,
        icono: <FaGavel/>,
        nombre: "Fiscalías de la Ciudad",
        layerProps: null
    },
    {
        id: 5,
        icono: <FaShoppingCart/>,
        nombre: "Ferias Itinerantes de Abastecimiento Barrial",
        layerProps: null
    },
    {
        id: 6,
        icono: <FaFlag/>,
        nombre: "Embajadas y Consulados",
        layerProps: null
    },
    {
        id: 7,
        icono: <FaWifi/>,
        nombre: "WiFi Gratis",
        layerProps: null
    },
    {
        id: 8,
        icono: <FaBriefcase/>,
        nombre: "Centros de Integración Laboral",
        layerProps: null
    },
    {
        id: 9,
        icono: <FaChurch/>,
        nombre: "Arquidiócesis (sin establecimientos educativos)",
        layerProps: null
    },
    {
        id: 10,
        icono: <FaMapMarkedAlt/>,
        nombre: "Arquidiócesis zonas",
        layerProps: null
    }
]


  return (
    <div className=''>
          <div className='d-flex m-0 p-2 justify-content-between align-items-center' style={{backgroundColor: `${color}`}}>
            <div className='fs-4'>Servicios</div>
            <button onClick={onBack} className='btn btn-transparent'>X</button>
          </div>
          <ul className="m-0 p-0">
          {
            itemsServicios.map((item) => {
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

export default Servicios