import { HashRouter, BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Contacto from "../pages/Contacto";
import MasInformacion from "../pages/MasInformacion";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar";
import Map from "../components/Map/Map";
import { AppProvider } from "../context/AppContext";
import { MapLayerProvider } from "../context/MapLayerContext";
import Layers from "../pages/Layers/Layers";
import { PATHS } from "../utils/consts/paths";
import SelectedLayersSidebar from "../pages/SelectedLayersSidebar";

const AppRoutes = () => {
  return (
    <HashRouter >
      <MapLayerProvider>
        <AppProvider>
          <Navbar />
          <div style={{ display: "flex" }}>
            <Sidebar>
              <Routes>
                <Route path={PATHS.contacto} element={<Contacto />} />
                <Route path={PATHS.masInformacion} element={<MasInformacion />} />
                <Route path={PATHS.layers} element={<Layers />} />
                <Route path={PATHS.temporalsLayers} element={<SelectedLayersSidebar />} />
                <Route path="*" element={<Navigate  to={PATHS.raiz} replace />} />
              </Routes>
            </Sidebar>
            <Map />
          </div>
        </AppProvider>
      </MapLayerProvider>
    </HashRouter>
  );
};

export default AppRoutes;
