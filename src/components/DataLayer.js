import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import GeoJSON from 'react-leaflet/GeoJSON';
import dataService from './dataService';

const DataLayer = ({ searchTitre }) => {
  const [features, setFeatures] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const map = useMap();

  // ⚡️ Met à jour les polygones visibles selon bbox
  const fetchVisibleFeatures = async () => {
    const bounds = map.getBounds();
    const bbox = {
      minLat: bounds.getSouth(),
      minLng: bounds.getWest(),
      maxLat: bounds.getNorth(),
      maxLng: bounds.getEast(),
    };

    const data = await dataService.getTotallPolygonesInBounds(bbox);
    setFeatures(data);
  };

  // 📦 Récupère les données au déplacement ou zoom
  useEffect(() => {
    fetchVisibleFeatures();

    map.on("moveend", fetchVisibleFeatures);
    return () => map.off("moveend", fetchVisibleFeatures);
  }, [map]);

  // 🔍 Gestion de la recherche
  useEffect(() => {
    const fetchBySearch = async () => {
      if (searchTitre) {
        const data = await dataService.getPolygonesBySearch(searchTitre);
        setSearchResults(data);

        if (data.length > 0) {
          const first = data[0].geometry;
          const coords = first.coordinates[0][0]; // pour les polygones
          map.flyTo([coords[1], coords[0]], 18);
        }
      }
    };

    fetchBySearch();
  }, [searchTitre, map]);

  // ➕ Fonction pour calculer le centroïde d'un polygone
  const getCentroid = (geometry) => {
    const coords = geometry.coordinates[0];
    const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    return [lat, lng];
  };

  const polygonStyle = {
    color: "blue",
    weight: 2,
    fillOpacity: 0.3,
  };

  return (
    <>
      {/* ✅ Polygones visibles */}
      {features.map((feature, index) => (
        <GeoJSON key={index} data={{
          type: "Feature",
          geometry: feature.geometry,
          properties: { titref: feature.titref }
        }} style={polygonStyle} />
      ))}

      {/* ✅ Résultats de recherche */}
      {searchResults.map((feature, index) => {
        const center = getCentroid(feature.geometry);
        return (
          <Marker key={`marker-${index}`} position={center} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>Titre foncier : {feature.titref}</Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default DataLayer;
