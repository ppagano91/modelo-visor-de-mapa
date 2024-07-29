import "../../../styles/Layers/Transporte/transporte.css";
import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import ListItems from "../../../components/ListItems";

const Otros = ({ color }) => {
  const [itemsOtros, setItemsOtros] = useState([]);
  const { hits } =
    useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const data = Object.keys(hits)
        .filter(key => key === 'otros')
        .reduce((obj, key) => {
          obj[key] = hits[key];
          return obj;
        }, {});
        const items = data.otros.elements.map(element => (
          element
        ))
        setItemsOtros(items);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ListItems nameSection={"Otros"} color={color} items={itemsOtros}/>
  );
};

export default Otros;
