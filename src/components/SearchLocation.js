// import { useMap } from "react-leaflet";
// import { useEffect } from "react";
// import L from "leaflet";
// import "leaflet-control-geocoder";
// import "leaflet-control-geocoder/dist/Control.Geocoder.css";
// import "./MapStyles.css";

// const SearchLocation = () => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const geocoder = L.Control.geocoder({
//       defaultMarkGeocode: true,
//     });

//     geocoder.addTo(map);

    
//     setTimeout(() => {
//       const geocoderContainer = document.querySelector(".leaflet-control-geocoder");
//       const zoomContainer = document.querySelector(".leaflet-top.leaflet-left");

//       if (geocoderContainer && zoomContainer) {
//         geocoderContainer.style.position = "absolute";
//         geocoderContainer.style.top = "50px";
//         geocoderContainer.style.left = "10px";
//         geocoderContainer.style.zIndex = "1000";
//         geocoderContainer.style.width = "250px";

//         zoomContainer.appendChild(geocoderContainer); 
//       }
//     }, 500);

//     return () => {
//       map.removeControl(geocoder);
//     };
//   }, [map]);

//   return null;
// };

// export default SearchLocation;




import React, { useEffect } from "react";
import "ol/ol.css";
import "ol-geocoder/dist/ol-geocoder.min.css";
import Geocoder from "ol-geocoder";

const SearchLocation = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      lang: "en",
      placeholder: "Search for ...",
      limit: 5,
      keepOpen: true,
    });

    map.addControl(geocoder);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
};

export default SearchLocation;