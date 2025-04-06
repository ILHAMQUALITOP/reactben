import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import DrawingTools from "./DrawingTools";
import SearchLocation from "./SearchLocation";
import ZoomInitialControl from "./ZoomInitialControl";
import UserLocation from "./UserLocation";
import FileImport from "./FileImport";
import ProjectionSelector from "./ProjectionSelector";
import SelectionTable from "./SelectionTable";
import dataService from "../Services/dataService";
import "./MapStyles.css";

// ✅ Fix Leaflet's default marker icons (needed for React)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import CustomDataLayer from "./map/custom-data-layer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const { BaseLayer, Overlay } = LayersControl;




// ✅ Main Map Component
const MapComponent = () => {
  const initialCenter = [32.24, -7.95]; // Adjust to your region
  const initialZoom = 14;
  const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
  const [searchTitre, setSearchTitre] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");

  const handleSearch = () => {
    console.log("🔎 Recherche déclenchée pour :", searchTitre);
    setSearchTrigger(searchTitre);
    setSearchTitre("");
  };

  return (
    <>
      <input
        type="text"
        placeholder="Rechercher un titre foncier"
        value={searchTitre}
        onChange={(e) => setSearchTitre(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: "5px 10px",
          borderRadius: "5px",
        }}
      />

      <MapContainer center={initialCenter} zoom={initialZoom} className="map-container" maxZoom={22}>
        <LayersControl position="topright">
          <BaseLayer checked name="Hybride">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google</a>'
              maxZoom={22}
            />
          </BaseLayer>
          <BaseLayer name="Carte Standard">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              maxZoom={22}
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google</a>'
              maxZoom={22}
            />
          </BaseLayer>

          <Overlay checked name="Parcelles + Titres Foncier">
            <LayerGroup>
              <CustomDataLayer searchTitre={searchTrigger} />
            </LayerGroup>
          </Overlay>
        </LayersControl>

        <ProjectionSelector onProjectionChange={(e) => setSelectedProjection(e.target.value)} />
        <DrawingTools selectedProjection={selectedProjection} />
        <SearchLocation />
        <ZoomInitialControl initialCenter={initialCenter} initialZoom={initialZoom} />
        <UserLocation />
        <FileImport />
        <SelectionTable selectedProjection={selectedProjection} />
      </MapContainer>
    </>
  );
};

export default MapComponent;
