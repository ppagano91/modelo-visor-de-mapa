import React, { useState, useEffect, useContext } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import ListItems from "../../../components/ListItems";

const Urbanismo = ({ color }) => {
  const [itemsUrbanismo, setItemsUrbanismo] = useState([]);
  const { hits } =
    useContext(MapLayerContext);

    useEffect(() => {
      const fetchData = async () => {
        try {        
          const data = Object.keys(hits)
          .filter(key => key === 'urbanismo')
          .reduce((obj, key) => {
            obj[key] = hits[key];
            return obj;
          }, {});
          console.log("data",data)
          const items = data.urbanismo.elements.map(element => (
            element
          ))
          setItemsUrbanismo(items);
        } catch (error) {
          console.error("Error fetching data from Elasticsearch:", error);
        }
      };
  
      fetchData();
    }, []);

  return (
    <ListItems nameSection={"Urbanismo"} color={color} items={itemsUrbanismo}/>
  );
};

export default Urbanismo;
