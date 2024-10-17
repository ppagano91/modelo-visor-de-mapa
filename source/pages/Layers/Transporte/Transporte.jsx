import "../../../styles/Layers/Transporte/transporte.css";
import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import ListItems from "../../../components/ListItems";

const Transporte = ({ color }) => {
  const [itemsTransporte, setItemsTransporte] = useState([]);
  const { hits } = useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = Object.keys(hits)
          .filter(key => key === "transporte")
          .reduce((obj, key) => {
            obj[key] = hits[key];
            return obj;
          }, {});

        const items = data.transporte.elements.map(element => element);
        setItemsTransporte(items);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ListItems
      nameSection={"Transporte"}
      color={color}
      items={itemsTransporte}
      style={{
        fontWeight: "bold",
        fontFamily: "Nunito",
      }}
    />
  );
};

export default Transporte;
