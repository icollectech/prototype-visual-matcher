import { useState } from "react";

/**
 * ----------------------------
 * SIMPLE VISUAL MATCH ENGINE
 * (works offline + mobile-friendly)
 * ----------------------------
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

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

function similarity(a, b) {
  return Math.max(0, 100 - hamming(a, b) * 2.5);
}

export default function App() {
  const [queryImage, setQueryImage] = useState(null);
  const [dbImages, setDbImages] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    if (!queryImage || dbImages.length === 0) {
      alert("Upload both query + database images");
      return;
    }

    setLoading(true);

    // build query image hash
    const qGray = await getImageData(queryImage);
    const qHash = buildHash(qGray);

    let matches = [];

    for (let img of dbImages) {
      const gray = await getImageData(img);
      const hash = buildHash(gray);

      const score = similarity(qHash, hash);

      const baseName = img.name.replace(/\.[^/.]+$/, "");

      matches.push({
        name: baseName,
        score: Number(score.toFixed(1)),
        image: URL.createObjectURL(img)
      });
    }

    // sort best match
    matches.sort((a, b) => b.score - a.score);

    const top = matches[0];

    // 🔥 USE BEST MATCH TO DRIVE SEARCH
    const searchQuery = `${top.name} prototype Apple EVT device`;

    const ebay = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`;
    const mercari = `https://www.mercari.com/search/?keyword=${encodeURIComponent(searchQuery)}`;
    const goofish = `https://www.goofish.com/search?q=${encodeURIComponent(searchQuery)}`;

    setResults([
      {
        ...top,
        links: { ebay, mercari, goofish }
      }
    ]);

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 Visual Prototype Matcher</h1>

      {/* QUERY IMAGE */}
      <h3>Query Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setQueryImage(e.target.files[0])}
      />

      {/* DATABASE IMAGES */}
      <h3>Database Images</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setDbImages(Array.from(e.target.files))}
      />

      <br /><br />

      <button
        onClick={runScan}
        style={{
          padding: "10px 15px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}
      >
        {loading ? "Scanning..." : "Run Visual Match"}
      </button>

      {/* RESULTS */}
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
            <img
              src={r.image}
              width="80"
              style={{ borderRadius: 6 }}
            />

            <h3>{r.name}</h3>
            <p>Match Score: {r.score}%</p>

            <div style={{ marginTop: 10 }}>
              <b>Marketplace Search:</b>
              <ul>
                <li>
                  <a href={r.links.ebay} target="_blank">
                    eBay Results
                  </a>
                </li>
                <li>
                  <a href={r.links.mercari} target="_blank">
                    Mercari Results
                  </a>
                </li>
                <li>
                  <a href={r.links.goofish} target="_blank">
                    Goofish Results
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
