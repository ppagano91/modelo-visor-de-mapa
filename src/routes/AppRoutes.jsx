import {useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComoLlego from '../pages/ComoLlego'
import Favoritos from '../pages/Favoritos'
import Contacto from '../pages/Contacto'
import MasInformacion from '../pages/MasInformacion'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Map from '../components/Map/Map'
import { AppProvider } from '../context/AppContext'
import { MapLayerProvider } from '../context/MapLayerContext'
import Layers from '../pages/Layers/Layers'

const AppRoutes = () => {  

  return (
    <MapLayerProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <div style={{ display: "flex" }}>
            <Sidebar>
              <Routes>
                <Route path="/" element={<ComoLlego />} />
                <Route path="/comollego" element={<ComoLlego />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/MasInformacion" element={<MasInformacion />} />
                <Route path="/layers" element={<Layers />} />
              </Routes>
            </Sidebar>
            <Map />
          </div>
        </BrowserRouter>
      </AppProvider>
    </MapLayerProvider>
  );
}

export default AppRoutes;