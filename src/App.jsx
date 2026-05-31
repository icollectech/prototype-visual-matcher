
import { useState } from "react";

/**
 * REALISTIC lightweight perceptual hash (no libraries)
 * - draws image to canvas
 * - reduces to 8x8 grayscale
 * - builds binary hash
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

export default function App() {
  const [query, setQuery] = useState(null);
  const [db, setDb] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleQuery(e) {
    setQuery(e.target.files[0]);
  }

  async function handleDb(e) {
    setDb(Array.from(e.target.files));
  }

  async function runMatch() {
    if (!query || db.length === 0) {
      alert("Upload query + database images first");
      return;
    }

    setLoading(true);

    const queryGray = await getImageData(query);
    const queryHash = buildHash(queryGray);

    let best = { name: "No match", score: 0 };

    for (let img of db) {
      const gray = await getImageData(img);
      const hash = buildHash(gray);

      const score = similarity(queryHash, hash);

      if (score > best.score) {
        best = { name: img.name, score };
      }
    }

    setResult(`${best.name} (${best.score.toFixed(1)}% match)`);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <h3>Query Image</h3>
      <input type="file" accept="image/*" onChange={handleQuery} />

      <h3>Database Images</h3>
      <input type="file" accept="image/*" multiple onChange={handleDb} />

      <button onClick={runMatch} style={{ marginTop: 20 }}>
        {loading ? "Matching..." : "Run Visual Match"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Best Match:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
