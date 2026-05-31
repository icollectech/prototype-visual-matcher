import { useState } from "react";

function buildQuery(fileName) {
  return (
    fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/IMG|DSC|photo|image|Screenshot|capture/gi, "")
      .trim() + " prototype EVT DVT Apple device"
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
    if (!image) {
      alert("Upload image first");
      return;
    }

    setLoading(true);

    try {
      const query = buildQuery(image.name);

      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!res.ok) {
        throw new Error("Backend error: " + res.status);
      }

      const data = await res.json();

      console.log("BACKEND RESPONSE:", data);

      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert("Backend failed. Check Vercel deployment.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 Prototype Marketplace Scanner</h1>

      <p>Upload 1 image → scan marketplace listings</p>

      <input type="file" accept="image/*" onChange={handleImage} />

      <br />
      <br />

      <button
        onClick={runScan}
        style={{
          padding: "10px 15px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        {loading ? "Scanning..." : "Scan Listings"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.length === 0 && !loading && (
          <p>No results yet.</p>
        )}

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
            {r.image && (
              <img
                src={r.image}
                width="80"
                alt=""
                style={{ borderRadius: 6 }}
              />
            )}

            <h3>{r.title}</h3>

            {r.price && <p>{r.price}</p>}

            <a href={r.url} target="_blank" rel="noreferrer">
              View Listing
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 
