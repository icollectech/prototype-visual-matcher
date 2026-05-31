import { useState } from "react";

function buildQuery(fileName) {
  return (
    fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/IMG|DSC|photo|image|Screenshot/gi, "")
      .trim() + " prototype EVT Apple device"
  );
}

export default function App() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  async function runScan() {
    if (!image) return alert("Upload image first");

    setLoading(true);

    const query = buildQuery(image.name);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 Prototype Marketplace Scanner (Backend)</h1>

      <input type="file" accept="image/*" onChange={handleImage} />

      <br /><br />

      <button onClick={runScan}>
        {loading ? "Scanning..." : "Scan Marketplaces"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8
            }}
          >
            <h3>{r.title}</h3>
            <p>{r.source}</p>
            <p>{r.price}</p>

            <a href={r.url} target="_blank">
              View Listings
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
