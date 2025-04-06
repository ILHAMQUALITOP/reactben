import { useState, useEffect, useCallback, useRef } from "react";
import { GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import proj4 from "proj4";
import dataService from "../../Services/dataService";

// ✅ Custom red marker icon
const customIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// ✅ Convert Lambert to LatLng
const convertLambertToLatLng = (x, y) => {
  const [lng, lat] = proj4("EPSG:26191", "EPSG:4326", [x, y]);
  return [lat, lng];
};

// ✅ Extract center of geometry
const getCenterOfGeometry = (geometry) => {
  try {
    let coord = null;
    if (geometry.type === "MultiPolygon") {
      coord = geometry.coordinates?.[0]?.[0]?.[0];
    } else if (geometry.type === "Polygon") {
      coord = geometry.coordinates?.[0]?.[0];
    }

    if (coord) {
      const [x, y] = coord;
      return convertLambertToLatLng(x, y);
    }
  } catch (err) {
    console.warn("Geometry error:", err);
  }
  return null;
};

// ✅ Convert full geometry to GeoJSON with LatLng
const convertGeometryToGeoJSON = (feature) => {
  const { type, coordinates } = feature.geometry;

  const convertCoords = (coords) => {
    return coords.map((ring) =>
      ring.map(([x, y]) => {
        const [lng, lat] = proj4("EPSG:26191", "EPSG:4326", [x, y]);
        return [lng, lat];
      })
    );
  };

  let converted = null;
  if (type === "Polygon") {
    converted = convertCoords(coordinates);
  } else if (type === "MultiPolygon") {
    converted = coordinates.map((polygon) => convertCoords(polygon));
  }

  return {
    type: "Feature",
    properties: feature.properties,
    geometry: {
      type,
      coordinates: converted,
    },
  };
};

const CustomDataLayer = ({ searchTitre = "" }) => {
  const [features, setFeatures] = useState([]);
  const [points, setPoints] = useState([]);
  const map = useMap();
  const lastSearchTitreRef = useRef(null); // ✅ Track last searched title

  const fetchVisibleFeatures = useCallback(async () => {
    try {
      const bounds = map.getBounds();

      const bbox = {
        minLat: bounds.getSouth(),
        minLng: bounds.getWest(),
        maxLat: bounds.getNorth(),
        maxLng: bounds.getEast(),
      };

      const data = await dataService.getTotallPolygonesInBounds(bbox); // Response in Lambert
      const fetchedFeatures = data?.features || [];

      const geoFeatures = fetchedFeatures.map(convertGeometryToGeoJSON);
      setFeatures(geoFeatures);

      const centerPoints = fetchedFeatures
        .map((f) => {
          const center = getCenterOfGeometry(f.geometry);
          return center
            ? { position: center, titref: f.properties?.titref }
            : null;
        })
        .filter(Boolean);

      // 🔍 Filtered by searchTitre
      const filteredPoints = centerPoints.filter((pt) =>
        pt.titref.toLowerCase().includes(searchTitre.toLowerCase())
      );

      setPoints(filteredPoints);

      // ✅ Fly to searched point only once per change
      if (
        searchTitre &&
        filteredPoints.length > 0 &&
        searchTitre !== lastSearchTitreRef.current
      ) {
        const target = filteredPoints[0];
        map.flyTo(target.position, 17, { duration: 1.5 });
        lastSearchTitreRef.current = searchTitre;
      }
    } catch (error) {
      console.error("Erreur chargement des polygones :", error);
    }
  }, [map, searchTitre]);

  useEffect(() => {
    fetchVisibleFeatures();
    map.on("moveend", fetchVisibleFeatures);
    return () => map.off("moveend", fetchVisibleFeatures);
  }, [fetchVisibleFeatures]);

  return (
    <>
      {/* 🟦 Blue Polygons */}
      {features.map((feature, index) => (
        <GeoJSON
          key={`poly-${index}`}
          data={feature}
          style={{
            color: "blue",
            weight: 2,
            fillColor: "blue",
            fillOpacity: 0.3,
          }}
          onEachFeature={(f, layer) => {
            layer.bindPopup(f.properties?.titref || "Sans titre");
          }}
        />
      ))}

      {/* 📍 Red Markers */}
      {points.map((pt, idx) => (
        <Marker key={`marker-${idx}`} position={pt.position} icon={customIcon}>
          <Popup>{pt.titref}</Popup>
        </Marker>
      ))}
    </>
  );
};

export default CustomDataLayer;
