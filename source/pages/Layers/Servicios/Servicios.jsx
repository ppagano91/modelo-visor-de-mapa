import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import ListItems from "../../../components/ListItems";

const Servicios = ({ color }) => {
  const [itemsServicios, setItemsServicios] = useState([]);
  const { hits } =
    useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = Object.keys(hits)
        .filter(key => key === 'servicios')
        .reduce((obj, key) => {
          obj[key] = hits[key];
          return obj;
        }, {});

        const items = data.servicios.elements.map(element => (
          element
        ))

        setItemsServicios(items);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ListItems nameSection={"Servicios"} color={color} items={itemsServicios}/>
  );
};

export default Servicios;
