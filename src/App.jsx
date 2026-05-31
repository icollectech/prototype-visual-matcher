import { useState } from "react";

/**
 * --- IMAGE PROCESSING (pHash-style) ---
 */

function getImageData(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 8;
      canvas.height = 8;

      ctx.drawImage(img, 0, 0, 8, 8);

      const data = ctx.getImageData(0, 0, 8, 8).data;

      let gray = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        gray.push((r + g + b) / 3);
      }

      resolve(gray);
    };
  });
}

function buildHash(gray) {
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  return gray.map((v) => (v > avg ? 1 : 0)).join("");
}

function hammingDistance(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

function similarity(a, b) {
  const dist = hammingDistance(a, b);
  return Math.max(0, 100 - dist * 2.5);
}

/**
 * --- SEARCH LINKS ---
 */

function generateSearchLinks(query) {
  return {
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    marketplace: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}`
  };
}

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dbImages, setDbImages] = useState([]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleQuery(e) {
    setQueryImage(e.target.files[0]);
  }

  async function handleDb(e) {
    setDbImages(Array.from(e.target.files));
  }

  async function runMatch() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload query image + database images first");
      return;
    }

    setLoading(true);

    const queryGray = await getImageData(queryImage);
    const queryHash = buildHash(queryGray);

    let matches = [];

    for (let img of dbImages) {
      const gray = await getImageData(img);
      const hash = buildHash(gray);

      const score = similarity(queryHash, hash);

      matches.push({
        name: img.name.replace(/\.[^/.]+$/, ""),
        score: Number(score.toFixed(1)),
        preview: URL.createObjectURL(img)
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top5 = matches.slice(0, 5).map((m) => ({
      ...m,
      links: generateSearchLinks(m.name)
    }));

    setResults(top5);
    setHistory((h) => [top5[0], ...h].slice(0, 10));

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🧠 Pro Collector Engine</h1>

      <p>Upload a prototype image + your database of known devices</p>

      {/* INPUTS */}
      <div style={{ marginTop: 20 }}>
        <h3>Query Image</h3>
        <input type="file" accept="image/*" onChange={handleQuery} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Prototype Database</h3>
        <input type="file" accept="image/*" multiple onChange={handleDb} />
      </div>

      <button
        onClick={runMatch}
        style={{
          marginTop: 20,
          padding: "10px 15px",
          cursor: "pointer",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}
      >
        {loading ? "Scanning Collection..." : "Run Collector Scan"}
      </button>

      {/* RESULTS */}
      {results.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Top Matches</h2>

          {results.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {/* HEADER WITH THUMBNAIL */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img
                  src={r.preview}
                  alt={r.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd"
                  }}
                />

                <div>
                  <h3 style={{ margin: 0 }}>
                    #{i + 1} {r.name}
                  </h3>

                  <p style={{ margin: 0 }}>
                    Confidence: {r.score}%
                  </p>
                </div>
              </div>

              {/* CONFIDENCE BAR */}
              <div
                style={{
                  height: 10,
                  background: "#eee",
                  borderRadius: 5,
                  overflow: "hidden",
                  marginTop: 10
                }}
              >
                <div
                  style={{
                    width: `${r.score}%`,
                    height: "100%",
                    background:
                      r.score > 70 ? "green" : r.score > 40 ? "orange" : "red"
                  }}
                />
              </div>

              {/* SEARCH LINKS */}
              <div style={{ marginTop: 10 }}>
