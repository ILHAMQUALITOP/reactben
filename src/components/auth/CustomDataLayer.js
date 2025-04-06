import { GeoJSON } from "react-leaflet";

const CustomDataLayer = ({ features }) => {
  if (!features || !features.features || features.features.length === 0) return null;

  return (
    <GeoJSON
      data={features}
      style={{
        color: "blue",
        weight: 2,
        fillOpacity: 0.3
      }}
      onEachFeature={(feature, layer) => {
        if (feature.properties && feature.properties.titref) {
          layer.bindPopup(`Titre foncier : ${feature.properties.titref}`);
        }
      }}
    />
  );
};

export default CustomDataLayer;
