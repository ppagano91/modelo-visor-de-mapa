import React, { useContext, useState } from 'react'
import DownloadModal from '../pages/Layers/Modal/DownloadModal';
import { MapLayerContext } from '../context/MapLayerContext';
import { CloudDownloadOutlined, InfoOutlined, PublicOutlined } from '@mui/icons-material';
import { AppContext } from '../context/AppContext';

const ListItems = ({nameSection, color, items }) => {
    const [showModal, setShowModal] = useState(false);
    const [downloadProps, setDownloadProps] = useState(null);
    const handleModalClose = () => setShowModal(false);
    const { toggleLayer, setActiveLayers, activeLayers } = useContext(MapLayerContext);
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
                {activeLayers && activeLayers.length
                ? `${activeLayers.length}`
                : null}
            </div>
            </div>
            <div></div>
            <button
            onClick={setActiveSectionNameNull}
            type="button"
            className="btn-close btn-close-white p-0 m-2"
            aria-label="Close"
            ></button>
        </div>
        <ul className="m-0 p-0">
            {items.map(item => {
            const isActive = activeLayers && activeLayers.includes(item.id);
            return (
                <div
                key={item.id}
                className="d-flex justify-content-between align-items-center list-item m-1 p-1"
                style={{ position: "relative"}}
                >
                <li
                    className="d-flex align-items-center flex-grow-1 gap-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={item.name}
                    onClick={() => handleItemClick(item.id, item.props)}
                    style={{
                    cursor: "pointer",                  
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    }}
                >
                    <input type="checkbox" checked={isActive} readOnly />
                    <p className="m-0 flex-grow-1">{item.name}</p>
                </li>
                <div className="d-flex gap-1 ms-auto">
                    <PublicOutlined
                    style={{ height: "1rem" }}
                    titleAccess="Acceso a Geoservicios"
                    onClick={e => {
                        handleGeoserviciosModal(e, item.props);
                    }}
                    />
                    <InfoOutlined
                    style={{ height: "1rem" }}
                    tooltip="Metadatos"
                    titleAccess="Metadatos"
                    onClick={e => {
                        handleMetadataModal(e, item.metadata);
                    }}
                    />
                    <CloudDownloadOutlined
                    style={{ height: "1rem" }}
                    tooltip="Descargar Geoservicios"
                    titleAccess="Descargar Geoservicios"
                    onClick={e => {handleModal(e, item.props);}}
                    />
                </div>
                </div>
            );
            })}
        </ul>
    </div>
    )
}

export default ListItems