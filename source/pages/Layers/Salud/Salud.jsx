import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import ListItems from "../../../components/ListItems";

const Salud = ({ color }) => {
  const [itemsSalud, setItemsSalud] = useState([]);
  const {  hits } =
    useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const data = Object.keys(hits)
        .filter(key => key === 'salud')
        .reduce((obj, key) => {
          obj[key] = hits[key];
          return obj;
        }, {});
        const items = data.salud.elements.map(element => (
          element
        ))
        setItemsSalud(items);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ListItems nameSection={"Salud"} color={color} items={itemsSalud}/>
  );
};

export default Salud;
