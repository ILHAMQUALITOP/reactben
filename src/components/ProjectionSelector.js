import React from "react";
import "../components/ProjectionSelector.css";

const projections = [
  { name: "Maroc Lambert Zone 1", code: "EPSG:26191" },
  { name: "Maroc Lambert Zone 2", code: "EPSG:26192" },
  { name: "Maroc Lambert Zone 3", code: "EPSG:26194" },
  { name: "Maroc Lambert Zone 4", code: "EPSG:26195" },
];

export default function ProjectionSelector({ setSelectedProjection }) {
  const handleProjectionChange = (event) => {
    setSelectedProjection(event.target.value);
    console.log(`Projection changée vers : ${event.target.value}`);
  };

  return (
    <div className="projection-selector">
      <label>Choisir une projection :</label>
      <select
        onChange={handleProjectionChange}
        defaultValue={projections[0].code}
      >
        {projections.map((proj) => (
          <option key={proj.code} value={proj.code}>
            {proj.name} ({proj.code})
          </option>
        ))}
      </select>
    </div>
  );
}
