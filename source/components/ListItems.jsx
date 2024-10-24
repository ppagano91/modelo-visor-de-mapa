import React, { useContext, useState, useEffect } from 'react';
import DownloadModal from '../pages/Layers/Modal/DownloadModal';
import { MapLayerContext } from '../context/MapLayerContext';
import { CloudDownloadOutlined, InfoOutlined, PublicOutlined, Recycling } from '@mui/icons-material';
import { AppContext } from '../context/AppContext';

const ListItems = ({ nameSection, color, items }) => {
  const [showModal, setShowModal] = useState(false);
  const [downloadProps, setDownloadProps] = useState(null);
  const [legendImageURLs, setLegendImageURLs] = useState({});
  const handleModalClose = () => setShowModal(false);
  const { toggleLayer, setActiveLayers, activeLayers, clearAllSelections } = useContext(MapLayerContext);
  const { handleMetadataModal, handleGeoserviciosModal, setActiveSectionNameNull } = useContext(AppContext);

  const handleModal = (e, layerProps) => {
    e.stopPropagation();

    if (layerProps) {
      setDownloadProps(layerProps);
    } else {
      setDownloadProps(null);
    }
    setShowModal(true);
  };

  const handleItemClick = (id, layerProps) => {
    if (layerProps !== null) {
      toggleLayer(layerProps);
    }

    setActiveLayers(prevActiveLayers => {
      if (prevActiveLayers.includes(id)) {
        return prevActiveLayers.filter(layerId => layerId !== id);
      } else {
        return [...prevActiveLayers, id];
      }
    });
  };

  const handleClearSelection = () => {
    clearAllSelections();
  };

  const fetchLegend = (layerName, urlBase) => {
    const params = {
      service: 'WMS',
      version: '1.1.0',
      request: 'GetLegendGraphic',
      format: 'image/png',
      layer: layerName,
      style: '',
      legend_options: 'fontName:Cantarell Bold;fontSize:11;fontColor:#2f00ff;forceLabels:on',
    };
    const url = urlBase + L.Util.getParamString(params, '', true);

    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const imgURL = URL.createObjectURL(blob);
        return imgURL;
      })
      .catch(error => {
        console.error('Error fetching legend:', error);
        return null;
      });
  };

  useEffect(() => {
    const fetchAllLegends = async () => {
      const newLegendImageURLs = {};
      for (const item of items) {
        if (item.props?.name && item.props?.url) {
          const imgURL = await fetchLegend(item.props.name, item.props.url);
          if (imgURL) {
            newLegendImageURLs[item.id] = imgURL;
          }
        }
      }
      setLegendImageURLs(newLegendImageURLs);
    };

    fetchAllLegends();
  }, [items]);

  return (
    <div>
      {downloadProps && (
        <DownloadModal
          show={showModal}
          handleClose={handleModalClose}
          downloadProps={downloadProps}
        />
      )}
      <div
        className="d-flex m-0 p-2 justify-content-between align-items-center"
        style={{ backgroundColor: `${color}` }}
      >
        <div className="fs-4 text-light list-group-item">
          {nameSection}
          <div className="badge fs-6 text-dark fw-bold bg-white opacity-50 px-2 mx-3">
            {activeLayers && activeLayers.length ? `${activeLayers.length}` : null}
          </div>
          {activeLayers && activeLayers.length > 0 && (
            <Recycling
              onClick={handleClearSelection}
              style={{ cursor: "pointer" }}
              titleAccess="Limpiar capas"
            ></Recycling>
          )}
        </div>
        <button
          onClick={setActiveSectionNameNull}
          type="button"
          className="btn-close btn-close-white p-0 m-2"
          aria-label="Close"
          title='Cerrar'
        ></button>
      </div>

      <ul className="mt-3 p-0">
        {items.map(item => {
          const isActive = activeLayers && activeLayers.includes(item.id);
          const legendURL = legendImageURLs[item.id];

          return (
            <li key={item.id} className="d-flex align-items-center justify-content-between" style={{ position: "relative" }}>
              {/* Detalles para la leyenda y el nombre */}
              <div className="flex-grow-1" style={{ marginRight: "20px" }}>

                <div
                  className="form-checkbox"
                  style={{ cursor: 'pointer' }}
                  
                >
                  <input
                    class="form-checkbox-input"
                    type="checkbox"
                    checked={isActive}
                    name="professionCheckbox"
                    id={item.name}
                    onClick={() => handleItemClick(item.id, item.props)}
                  />
                  <label class="form-checkbox-label"  for={item.name} >
                    {item.name}
                  </label>
                 
                </div>
                {/*   <div
                  className="d-flex align-items-center gap-2 form-checkbox"
                  style={{ cursor: 'pointer', outline: 'none' }}
                  onClick={() => handleItemClick(item.id, item.props)}
                >
                  <input type="checkbox"  checked={isActive} readOnly />
                  <p
                    className="m-0 flex-grow-1 "
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: '14rem'
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </p>
                </div> */}

                {/* Contenido de la leyenda */}
                {isActive && legendURL && (
                  <div style={{ paddingLeft: "20px", backgroundColor: "white" }}>
                    <img src={legendURL} alt={`Leyenda de ${item.name}`} />
                  </div>
                )}
              </div>
              <div className="d-flex gap-1 align-items-center" style={{ position: "absolute", right: "0.25rem", top: "0.75rem" }}>
                <PublicOutlined
                  style={{ height: "1rem", cursor: "pointer" }}
                  titleAccess="Acceso a Geoservicios"
                  onClick={e => {
                    handleGeoserviciosModal(e, item.props);
                  }}
                />
                <InfoOutlined
                  style={{ height: "1rem", cursor: "pointer" }}
                  tooltip="Metadatos"
                  titleAccess="Metadatos"
                  onClick={e => {
                    handleMetadataModal(e, item.metadata);
                  }}
                />
                <CloudDownloadOutlined
                  style={{ height: "1rem", cursor: "pointer" }}
                  tooltip="Descargar Geoservicios"
                  titleAccess="Descargar Geoservicios"
                  onClick={e => {
                    handleModal(e, item.props);
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

    </div>
  );



};

export default ListItems;
