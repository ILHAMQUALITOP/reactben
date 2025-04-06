import axios from 'axios';

const API_URL = "http://localhost:5050/api";

const dataService = {
  async getTotallPolygonesInBounds(bbox) {
    try {
      const url = `${API_URL}/geo-data/polygones?minLat=${bbox.minLat}&minLng=${bbox.minLng}&maxLat=${bbox.maxLat}&maxLng=${bbox.maxLng}`;
      const response = await axios.get(url);
      return response.data; // GeoJSON format
    } catch (error) {
      console.error("❌ Erreur chargement bbox:", error);
      return { type: "FeatureCollection", features: [] };
    }
  },

  async getPolygonesBySearch(numeroTitre) {
    try {
      const url = `${API_URL}/geo-data/search?numero_titre=${encodeURIComponent(numeroTitre)}`;
      const response = await axios.get(url);
      return response.data; // GeoJSON format
    } catch (error) {
      console.error("❌ Erreur recherche titre:", error);
      return { type: "FeatureCollection", features: [] };
    }
  }
};

export default dataService;
