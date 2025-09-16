import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function App() {
  const API_BASE = "https://ground-water-monitoring.onrender.com";

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stations, setStations] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [filter, setFilter] = useState("latest");

  const [data, setData] = useState(null);

  // Load states on mount
  useEffect(() => {
    axios.get(`${API_BASE}/states`).then(res => setStates(res.data));
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      axios.get(`${API_BASE}/districts/${selectedState}`).then(res => setDistricts(res.data));
    }
  }, [selectedState]);

  // Load stations when district changes
  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`${API_BASE}/stations?district=${selectedDistrict}`).then(res => setStations(res.data));
    }
  }, [selectedDistrict]);

  // Fetch station data
  const fetchData = () => {
    if (!selectedStation) return;
    axios.get(`${API_BASE}/station/${selectedStation}?filter=${filter}`)
      .then(res => setData(res.data));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌊 Groundwater Monitoring Dashboard</h1>

      {/* State Dropdown */}
      <div style={{ marginBottom: 10 }}>
        <label>State: </label>
        <select value={selectedState} onChange={e => {
          setSelectedState(e.target.value);
          setDistricts([]);
          setStations([]);
          setSelectedDistrict("");
          setSelectedStation("");
        }}>
          <option value="">-- Select State --</option>
          {states.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>

      {/* District Dropdown */}
      <div style={{ marginBottom: 10 }}>
        <label>District: </label>
        <select value={selectedDistrict} onChange={e => {
          setSelectedDistrict(e.target.value);
          setStations([]);
          setSelectedStation("");
        }}>
          <option value="">-- Select District --</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Station Dropdown */}
      <div style={{ marginBottom: 10 }}>
        <label>Station: </label>
        <select value={selectedStation} onChange={e => setSelectedStation(e.target.value)}>
          <option value="">-- Select Station --</option>
          {stations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: 10 }}>
        <label>Filter: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="day">Last Day</option>
          <option value="month">Last Month</option>
          <option value="season">Last Season</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <button onClick={fetchData} style={{ padding: "5px 15px", background: "skyblue", border: "none" }}>
        Fetch Data
      </button>

      {/* Data Display */}
      {data && (
        <div style={{ marginTop: 20 }}>
          <h2>Station: {data.station_id}</h2>
          <p>State: {data.state}</p>
          <p>District: {data.district}</p>
          <p>Filter: {data.filter}</p>
          <p>Count: {data.summary.count}</p>
          <p>Min: {data.summary.min}</p>
          <p>Max: {data.summary.max}</p>
          <p>Avg: {data.summary.avg}</p>

          {/* Graph */}
          <div style={{ width: "100%", height: 300, marginTop: 20 }}>
            <ResponsiveContainer>
              <LineChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="water_level" stroke="#007BFF" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
