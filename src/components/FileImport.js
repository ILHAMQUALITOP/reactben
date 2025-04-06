import React, { useRef } from "react";
import "./FileImport.css"; // Assurez-vous d'avoir ce fichier CSS

export default function FileImport({ onFileLoad }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-import-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => console.log("Fichier sélectionné :", e.target.files[0])}
        accept=".geojson,.json,.shp,.zip,.dxf,.kml"
        style={{ display: "none" }}
      />
      <button className="file-import-button" onClick={handleButtonClick}>
        📂 Importer un fichier
      </button>
    </div>
  );
}

// import React, { useRef } from "react";
// import shp from "shpjs";
// import DxfParser from "dxf-parser";
// import { kml } from "@tmcw/togeojson";

// export default function FileImport({ onFileLoad }) {
//   const fileInputRef = useRef(null);

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     // Lecture du fichier en fonction de son type
//     if (file.name.endsWith(".shp") || file.name.endsWith(".zip")) {
//       reader.onload = async (e) => {
//         try {
//           const geojson = await shp(e.target.result);
//           onFileLoad(geojson);
//         } catch (error) {
//           console.error("Erreur lors de l'importation SHP :", error);
//           alert("Impossible de lire le fichier SHP.");
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     } 
//     else if (file.name.endsWith(".dxf")) {
//       reader.onload = (e) => {
//         try {
//           const parser = new DxfParser();
//           const dxfData = parser.parseSync(e.target.result);
//           const entities = dxfData.entities.map((entity) => ({
//             type: "Feature",
//             geometry: {
//               type: "Point",
//               coordinates: [entity.position.x, entity.position.y],
//             },
//             properties: { layer: entity.layer },
//           }));
//           const geojson = { type: "FeatureCollection", features: entities };
//           onFileLoad(geojson);
//         } catch (error) {
//           console.error("Erreur lors de l'importation DXF :", error);
//           alert("Impossible de lire le fichier DXF.");
//         }
//       };
//       reader.readAsText(file);
//     } 
//     else if (file.name.endsWith(".kml")) {
//       reader.onload = (e) => {
//         try {
//           const dom = new DOMParser().parseFromString(e.target.result, "text/xml");
//           const geojson = kml(dom);
//           onFileLoad(geojson);
//         } catch (error) {
//           console.error("Erreur lors de l'importation KML :", error);
//           alert("Impossible de lire le fichier KML.");
//         }
//       };
//       reader.readAsText(file);
//     } 
//     else {
//       alert("Format de fichier non pris en charge.");
//     }
//   };

//   return (
//     <div className="file-import-container">
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept=".geojson,.json,.shp,.zip,.dxf,.kml"
//         style={{ display: "none" }}
//       />
//       <button className="file-import-button" onClick={() => fileInputRef.current.click()}>
//         📂 Importer un fichier
//       </button>
//     </div>
//   );
// }
