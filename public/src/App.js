import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [stations, setStations] = useState([]);
  const [data, setData] = useState(null);

  // 🔹 Replace with your Render backend URL
  const API_BASE = "https://your-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API_BASE}/stations`)
      .then(res => setStations(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchData = (station) => {
    axios.get(`${API_BASE}/station/${station}?filter=latest`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌊 Groundwater Monitoring</h1>

      {stations.map(st => (
        <button
          key={st}
          onClick={() => fetchData(st)}
          style={{
            margin: "5px",
            padding: "10px",
            background: "skyblue",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {st}
        </button>
      ))}

      {data && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid gray" }}>
          <h2>Station: {data.station_id}</h2>
          <p>Filter: {data.filter}</p>
          <p>Count: {data.summary.count}</p>
          <p>Min: {data.summary.min}</p>
          <p>Max: {data.summary.max}</p>
          <p>Avg: {data.summary.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
