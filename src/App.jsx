import { useState } from "react";

/**
 * --- IMAGE HASH (lightweight pHash style) ---
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
 * --- MARKET SEARCH GENERATOR ---
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
  const [result, setResult] = useState(null);
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

    let best = { name: "Unknown Prototype Device", score: 0 };

    for (let img of dbImages) {
      const gray = await getImageData(img);
      const hash = buildHash(gray);

      const score = similarity(queryHash, hash);

      if (score > best.score) {
        best = {
          name: img.name.replace(/\.[^/.]+$/, ""),
          score
        };
      }
    }

    const links = generateSearchLinks(best.name);

    setResult({
      name: best.name,
      score: best.score.toFixed(1),
      links
    });

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Search Engine</h1>

      <p>Upload a prototype image and search your database + marketplaces</p>

      <h3>Query Image</h3>
      <input type="file" accept="image/*" onChange={handleQuery} />

      <h3>Database (known prototypes)</h3>
      <input type="file" accept="image/*" multiple onChange={handleDb} />

      <button on
