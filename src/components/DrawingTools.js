// import React, { useState, useRef } from "react";
// import { FeatureGroup } from "react-leaflet";
// import { EditControl } from "react-leaflet-draw";
// import L from "leaflet";
// import "leaflet-draw/dist/leaflet.draw.css";
// import "./DrawingTools.css";
// import ProjectionSelector from "./ProjectionSelector";
// import SelectionTable from "./SelectionTable";
// import { convertCoordinates, calculateDistance, calculatePolygonMetrics } from "../utils/calculations";
// import proj4 from 'proj4';
// proj4.defs('EPSG:26191', '+proj=lcc +lat_1=33.3 +lat_2=31.7 +lat_0=32.0 +lon_0=-6.0 +x_0=500000 +y_0=300000 +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:26192', '+proj=lcc +lat_1=33.3 +lat_2=31.7 +lat_0=32.0 +lon_0=-6.0 +x_0=500000 +y_0=300000 +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:26194', '+proj=lcc +lat_1=33.3 +lat_2=31.7 +lat_0=32.0 +lon_0=-6.0 +x_0=500000 +y_0=300000 +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:26195', '+proj=lcc +lat_1=33.3 +lat_2=31.7 +lat_0=32.0 +lon_0=-6.0 +x_0=500000 +y_0=300000 +datum=WGS84 +units=m +no_defs');
// export default function DrawingTools() {
//   const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
//   const [coordinates, setCoordinates] = useState([]);
//   const [forceRender, setForceRender] = useState(false);
//   const featureGroupRef = useRef(null);
//   const [showTable, setShowTable] = useState(false);

//   // 🔹 Gérer la création des formes
//   const handleDrawCreate = (e) => {
//     const layer = e.layer;
//     let newCoordinates = [];
//     let type = "";
//     let metrics = {};

//     if (layer instanceof L.Polygon) {
//       type = "Polygone";
//       const latLngs = layer.getLatLngs()[0];
//       newCoordinates = latLngs.map((latlng) => {
//         const converted = convertCoordinates(latlng, selectedProjection);
//         console.log(`Polygon point: ${latlng.lat}, ${latlng.lng} -> ${converted}`);
//         return converted;
//       });
//       metrics = calculatePolygonMetrics(newCoordinates, selectedProjection);
//     } else if (layer instanceof L.Polyline) {
//       type = "Ligne";
//       const latLngs = layer.getLatLngs();
//       newCoordinates = latLngs.map((latlng) => {
//         const converted = convertCoordinates(latlng, selectedProjection);
//         console.log(`Polyline point: ${latlng.lat}, ${latlng.lng} -> ${converted}`);
//         return converted;
//       });
//       metrics = { distance: calculateDistance(newCoordinates, selectedProjection) };
//     } else if (layer instanceof L.Marker) {
//       type = "Point";
//       const latlng = layer.getLatLng();
//       const converted = convertCoordinates(latlng, selectedProjection);
//       console.log(`Marker point: ${latlng.lat}, ${latlng.lng} -> ${converted}`);
//       newCoordinates = [converted];
//     }

//     console.log("New Coordinates:", newCoordinates); // Debugging line

//     setCoordinates((prev) => {
//       const newCoord = { id: layer._leaflet_id, type, coords: newCoordinates, ...metrics };
//       const updatedCoordinates = prev.some(coord => JSON.stringify(coord) === JSON.stringify(newCoord)) ? prev : [...prev, newCoord];
//       console.log("Updated Coordinates State:", updatedCoordinates); // Debugging line
//       return updatedCoordinates;
//     });
//     setShowTable(true);
//     setForceRender((prev) => !prev);

//     if (featureGroupRef.current) {
//       featureGroupRef.current.addLayer(layer);
//     }
//   };

//   // 🔹 Supprimer un point spécifique d'une ligne ou d'un polygone
//   const handleDeletePoint = (shapeId, pointIndex) => {
//     setCoordinates((prev) =>
//       prev
//         .map((shape) => {
//           if (shape.id === shapeId) {
//             const updatedCoords = shape.coords.filter((_, index) => index !== pointIndex);
//             if (updatedCoords.length === 0) return null; // Supprimer la forme si plus de points
//             return { ...shape, coords: updatedCoords };
//           }
//           return shape;
//         })
//         .filter(Boolean)
//     );

//     // 🔥 Mise à jour de la carte en supprimant la forme et la redessinant si nécessaire
//     if (featureGroupRef.current) {
//       featureGroupRef.current.eachLayer((layer) => {
//         if (layer._leaflet_id === shapeId) {
//           featureGroupRef.current.removeLayer(layer);
//           if (coordinates.find((shape) => shape.id === shapeId)?.coords.length > 0) {
//             featureGroupRef.current.addLayer(layer);
//           }
//         }
//       });
//     }

//     setForceRender((prev) => !prev);
//   };

//   // 🔹 Supprimer toutes les formes
//   const clearSelection = () => {
//     setCoordinates([]);
//     if (featureGroupRef.current) {
//       featureGroupRef.current.clearLayers();
//     }
//     setShowTable(false);
//     setForceRender((prev) => !prev);
//   };

//   return (
//     <div>
//       <ProjectionSelector setSelectedProjection={setSelectedProjection} />
//       <p>Projection sélectionnée : {selectedProjection}</p>

//       <FeatureGroup ref={featureGroupRef}>
//         <EditControl
//           position="topleft"
//           draw={{
//             polygon: { shapeOptions: { color: "#f357a1" } },
//             polyline: { shapeOptions: { color: "#f357a1" } },
//             marker: true,
//             circle: false,
//             circlemarker: false,
//           }}
//           onCreated={handleDrawCreate}
//         />
//       </FeatureGroup>

//       {showTable && coordinates.length > 0 && (
//         <SelectionTable
//           coordinates={coordinates}
//           onClear={clearSelection}
//           onDeletePoint={handleDeletePoint}
//           selectedProjection={selectedProjection}
//         />
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import "ol/ol.css";
// import { Draw, Modify, Snap } from "ol/interaction";
// import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import { fromLonLat, toLonLat, transform } from "ol/proj";
// import proj4 from "proj4";
// import { register } from "ol/proj/proj4";
// import ProjectionSelector from "./ProjectionSelector";
// import SelectionTable from "./SelectionTable";
// import { calculateDistance, calculatePolygonMetrics } from "../utils/calculations";
// import Polygon from "ol/geom/Polygon";
// import LineString from "ol/geom/LineString";
// import Point from "ol/geom/Point";

// // Lambert Zone 1 (EPSG:26191)
// proj4.defs(
//   "EPSG:26191",
//   "+proj=lcc +lat_1=32.5 +lat_2=35 +lat_0=33.3 +lon_0=-5.4 +k_0=1 +x_0=500000 +y_0=300000 +datum=WGS84 +units=m +no_defs"
// );

// // Lambert Zone 2 (EPSG:26192)
// proj4.defs(
//   "EPSG:26192",
//   "+proj=lcc +lat_1=32.5 +lat_2=35 +lat_0=33.3 +lon_0=-5.4 +k_0=1 +x_0=500000 +y_0=400000 +datum=WGS84 +units=m +no_defs"
// );

// // Lambert Zone 3 (EPSG:26194)
// proj4.defs(
//   "EPSG:26194",
//   "+proj=lcc +lat_1=32.5 +lat_2=35 +lat_0=33.3 +lon_0=-5.4 +k_0=1 +x_0=500000 +y_0=600000 +datum=WGS84 +units=m +no_defs"
// );

// // Lambert Zone 4 (EPSG:26195)
// proj4.defs(
//   "EPSG:26195",
//   "+proj=lcc +lat_1=32.5 +lat_2=35 +lat_0=33.3 +lon_0=-5.4 +k_0=1 +x_0=500000 +y_0=800000 +datum=WGS84 +units=m +no_defs"
// );

// // Enregistrer les projections dans OpenLayers
// register(proj4);

// const convertCoordinates = (coords, sourceEPSG, targetEPSG) => {
//   if (sourceEPSG === targetEPSG) {
//     return coords; // Pas de conversion nécessaire
//   }
//   return transform(coords, sourceEPSG, targetEPSG);
// };

// export default function DrawingTools({ map }) {
//   const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
//   const [coordinates, setCoordinates] = useState([]);
//   const [forceRender, setForceRender] = useState(false);
//   const [showTable, setShowTable] = useState(false);
//   const vectorSource = useRef(new VectorSource()).current;
//   const [drawType, setDrawType] = useState(null);

//   useEffect(() => {
//     if (!map) return;

//     const vectorLayer = new VectorLayer({
//       source: vectorSource,
//       style: new Style({
//         fill: new Fill({
//           color: 'rgba(255, 255, 255, 0.2)',
//         }),
//         stroke: new Stroke({
//           color: '#ffcc33',
//           width: 2,
//         }),
//         image: new CircleStyle({
//           radius: 7,
//           fill: new Fill({
//             color: '#ffcc33',
//           }),
//         }),
//       }),
//     });

//     map.addLayer(vectorLayer);

//     let drawInteraction;

//     if (drawType) {
//       drawInteraction = new Draw({
//         source: vectorSource,
//         type: drawType,
//       });

//       map.addInteraction(drawInteraction);

//       drawInteraction.on('drawend', (event) => {
//         const feature = event.feature;
//         const geom = feature.getGeometry();
//         let newCoordinates = [];
//         let type = "";
//         let metrics = {};

//         if (geom instanceof Polygon) {
//           type = "Polygone";
//           const latLngs = geom.getCoordinates()[0];
//           newCoordinates = latLngs.map((latlng) => toLonLat(latlng));
//           metrics = calculatePolygonMetrics(newCoordinates, "EPSG:4326");
//         } else if (geom instanceof LineString) {
//           type = "Ligne";
//           const latLngs = geom.getCoordinates();
//           newCoordinates = latLngs.map((latlng) => toLonLat(latlng));
//           metrics = { distance: calculateDistance(newCoordinates, "EPSG:4326") };
//         } else if (geom instanceof Point) {
//           type = "Point";
//           const latlng = geom.getCoordinates();
//           newCoordinates = [toLonLat(latlng)];
//         }

//         // Convertir les coordonnées en fonction de la projection sélectionnée
//         const convertedCoordinates = newCoordinates.map(coord => convertCoordinates(coord, "EPSG:4326", selectedProjection));

//         setCoordinates((prev) => {
//           const newCoord = { id: Date.now(), type, coords: convertedCoordinates, ...metrics };
//           const updatedCoordinates = prev.some(coord => JSON.stringify(coord) === JSON.stringify(newCoord)) ? prev : [...prev, newCoord];
//           return updatedCoordinates;
//         });
//         setShowTable(true);
//         setForceRender((prev) => !prev);
//       });
//     }

//     return () => {
//       if (drawInteraction) {
//         map.removeInteraction(drawInteraction);
//       }
//     };
//   }, [map, vectorSource, drawType, selectedProjection]);

//   const handleDeletePoint = (shapeId, pointIndex) => {
//     setCoordinates((prev) =>
//       prev
//         .map((shape) => {
//           if (shape.id === shapeId) {
//             const updatedCoords = shape.coords.filter((_, index) => index !== pointIndex);
//             if (updatedCoords.length === 0) return null;
//             return { ...shape, coords: updatedCoords };
//           }
//           return shape;
//         })
//         .filter(Boolean)
//     );

//     if (vectorSource) {
//       vectorSource.getFeatures().forEach((feature) => {
//         if (feature.getId() === shapeId) {
//           vectorSource.removeFeature(feature);
//           if (coordinates.find((shape) => shape.id === shapeId)?.coords.length > 0) {
//             vectorSource.addFeature(feature);
//           }
//         }
//       });
//     }

//     setForceRender((prev) => !prev);
//   };

//   const clearSelection = () => {
//     setCoordinates([]);
//     vectorSource.clear();
//     setShowTable(false);
//     setForceRender((prev) => !prev);
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
//         <button onClick={() => setDrawType('Point')}>Dessiner un Point</button>
//         <button onClick={() => setDrawType('LineString')}>Dessiner une Ligne</button>
//         <button onClick={() => setDrawType('Polygon')}>Dessiner un Polygone</button>
//       </div>

//       <ProjectionSelector selectedProjection={selectedProjection} setSelectedProjection={setSelectedProjection} />

//       {showTable && coordinates.length > 0 && (
//         <SelectionTable
//           coordinates={coordinates}
//           onClear={clearSelection}
//           onDeletePoint={handleDeletePoint}
//           selectedProjection={selectedProjection}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "./DrawingTools.css";
import ProjectionSelector from "./ProjectionSelector";
import SelectionTable from "./SelectionTable";
import {
  convertCoordinates,
  calculateDistance,
  calculatePolygonMetrics,
} from "../utils/calculations";

export default function DrawingTools() {
  const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
  const [coordinates, setCoordinates] = useState([]);
  const featureGroupRef = useRef(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    console.log("📡 Projection sélectionnée :", selectedProjection);
  }, [selectedProjection]);

  const handleDrawCreate = (e) => {
    const layer = e.layer;
    let newCoordinates = [];
    let type = "";
    let metrics = {};

    if (!layer) {
      console.error("❌ Erreur : Aucun objet de dessin détecté !");
      return;
    }

    // 🔹 Gestion des types de formes
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      type = layer instanceof L.Polygon ? "Polygone" : "Ligne";
      let latLngs = layer.getLatLngs();

      if (!latLngs || latLngs.length === 0) {
        console.error(
          `⚠️ Erreur : Aucune coordonnée trouvée pour le ${type} !`
        );
        return;
      }

      if (Array.isArray(latLngs[0])) {
        latLngs = latLngs[0]; // Extraction du premier tableau dans le cas des polygones
      }

      newCoordinates = processCoordinates(latLngs);
      metrics =
        type === "Polygone"
          ? calculatePolygonMetrics(newCoordinates, selectedProjection)
          : { distance: calculateDistance(newCoordinates, selectedProjection) };
    } else if (layer instanceof L.Marker) {
      type = "Point";
      const latLng = layer.getLatLng();
      if (!latLng) {
        console.error("⚠️ Impossible de récupérer les coordonnées du point !");
        return;
      }
      newCoordinates = processCoordinates([latLng]);
    }

    if (!Array.isArray(newCoordinates) || newCoordinates.length === 0) {
      console.error("⚠️ Erreur : Aucune coordonnée valide trouvée !");
      return;
    }

    console.log(
      "🌍 Avant conversion - WGS84:",
      formatCoordsLog(newCoordinates, true)
    );
    console.log(
      "📌 Après conversion -",
      selectedProjection,
      formatCoordsLog(newCoordinates, false)
    );

    // 🔹 Mise à jour des coordonnées dans le state
    const newShape = {
      id: layer._leaflet_id,
      type,
      coords: newCoordinates,
      ...metrics,
    };
    setCoordinates((prev) => [...prev, newShape]);
    setShowTable(true);

    // 🔹 Ajout au groupe de dessin
    featureGroupRef.current?.addLayer(layer);
  };

  // 🔹 Fonction pour convertir et structurer les coordonnées
  const processCoordinates = (latLngs) => {
    if (!Array.isArray(latLngs)) {
      console.error("⚠️ Données de coordonnées invalides :", latLngs);
      return [];
    }
    return latLngs
      .map((latlng) => {
        if (
          !latlng ||
          typeof latlng.lat !== "number" ||
          typeof latlng.lng !== "number"
        ) {
          console.warn("⚠️ Coordonnée invalide détectée :", latlng);
          return null;
        }

        const converted = convertCoordinates(
          { lat: latlng.lat, lng: latlng.lng },
          selectedProjection
        );
        return converted.x !== null && converted.y !== null
          ? {
              originalLat: latlng.lat,
              originalLng: latlng.lng,
              x: converted.x,
              y: converted.y,
            }
          : null;
      })
      .filter(Boolean);
  };

  // 🔹 Fonction pour afficher les logs des coordonnées de manière claire
  const formatCoordsLog = (coords, isOriginal) => {
    return coords.map((c) =>
      isOriginal ? `(${c.originalLat}, ${c.originalLng})` : `(${c.x}, ${c.y})`
    );
  };

  const handleDeletePoint = (shapeId, pointIndex) => {
    setCoordinates((prev) => {
      const updatedShapes = prev
        .map((shape) => {
          if (shape.id === shapeId) {
            const updatedCoords = shape.coords.filter(
              (_, index) => index !== pointIndex
            );
            return updatedCoords.length
              ? { ...shape, coords: updatedCoords }
              : null;
          }
          return shape;
        })
        .filter(Boolean);

      setShowTable(updatedShapes.length > 0);
      return updatedShapes;
    });

    // 🔹 Suppression du point sur la carte
    featureGroupRef.current?.eachLayer((layer) => {
      if (layer._leaflet_id === shapeId) {
        featureGroupRef.current.removeLayer(layer);
      }
    });
  };

  const clearSelection = () => {
    setCoordinates([]);
    featureGroupRef.current?.clearLayers();
    setShowTable(false);
  };

  return (
    <div>
      <ProjectionSelector setSelectedProjection={setSelectedProjection} />
      <p>Projection sélectionnée : {selectedProjection}</p>

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topleft"
          draw={{
            polygon: { shapeOptions: { color: "#f357a1" } },
            polyline: { shapeOptions: { color: "#f357a1" } },
            marker: true,
            circle: false,
            circlemarker: false,
          }}
          onCreated={handleDrawCreate}
        />
      </FeatureGroup>
     

      {showTable && coordinates.length > 0 && (
        <SelectionTable
          coordinates={coordinates}
          onClear={clearSelection}
          onDeletePoint={handleDeletePoint}
          selectedProjection={selectedProjection}
        />
      )}
    </div>
  );
}
