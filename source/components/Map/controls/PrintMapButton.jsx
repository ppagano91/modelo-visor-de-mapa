import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import '../../../plugins/leaflet-easyprint';
import L from "leaflet";

const PrintMapButton = ({ position = "bottomright" }) => {
  const map = useMap();
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const easyPrint = L.easyPrint({
      printHeader: 'Mapa de la Ciudad de Buenos Aires',
      title: 'Imprimir mapa',
      position: position || 'bottomright',
      exportOnly: false,
      hideControlContainer: true,
      sizeModes: ['Current'],
      filename: 'mapa',
      exportType: 'png',
      printLayer: true,
      onError: (error) => {
        setErrorMessage(
          <p className="errorMessage">
            Error en la impresión del Mapa. Por favor, intente imprimir otro Mapa Base.
          </p>
        );
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          setErrorMessage("");
        }, 3000);
      }
    }).addTo(map);

    return () => {
      easyPrint.remove();
    };
  }, [map, position]);

  return (
    <div>
      {showModal && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <p style={{marginBottom:"0px"}}>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos para el modal
const modalStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "1000",
};

const modalContentStyles = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
};

export default PrintMapButton;
