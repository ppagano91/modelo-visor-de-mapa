import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComoLlego from '../pages/ComoLlego'
import Favoritos from '../pages/Favoritos'
import Contacto from '../pages/Contacto'
import MasInformacion from '../pages/MasInformacion'
import Sidebar from '../components/Sidebar/Sidebar'
import Navbar from '../components/Navbar'
import Map from '../components/Map/Map'
import { AppProvider } from '../context/AppContext'
import { MapLayerProvider } from '../context/MapLayerContext'
import Layers from '../pages/Layers/Layers'
import {PATHS} from "../utils/consts/paths"

const AppRoutes = () => {  

  return (
    <BrowserRouter>
      <MapLayerProvider>
        <AppProvider>
            <Navbar />
            <div style={{ display: "flex" }}>
              <Sidebar>
                <Routes>
                  <Route path={PATHS.raiz} element={<ComoLlego />} />
                  <Route path={PATHS.contacto} element={<Contacto />} />
                  <Route path={PATHS.masInformacion} element={<MasInformacion />} />
                  <Route path={PATHS.layers} element={<Layers />} />
                </Routes>
              </Sidebar>
              <Map />
            </div>
        </AppProvider>
      </MapLayerProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;