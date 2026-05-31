import { useState } from "react";

function getPixels(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 16;
      canvas.height = 16;

      ctx.drawImage(img, 0, 0, 16, 16);

      const data = ctx.getImageData(0, 0, 16, 16).data;

      let arr = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        arr.push((r + g + b) / 3);
      }

      resolve(arr);
    };
  });
}

function compare(a, b) {
  let diff = 0;

  for (let i = 0; i < a.length; i++) {
    diff += Math.abs(a[i] - b[i]);
  }

  return Math.max(0, 100 - diff / 10);
}

export default function App() {
  const [query, setQuery] = useState(null);
  const [db, setDb] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    if (!query || db.length === 0) {
      alert("Upload query + database images");
      return;
    }

    setLoading(true);

    const q = await getPixels(query);

    let matches = [];

    for (let file of db) {
      const p = await getPixels(file);

      const score = compare(q, p);

      const name = file.name.replace(/\.[^/.]+$/, "");

      matches.push({
        name,
        score: Number(score.toFixed(1)),
        image: URL.createObjectURL(file)
      });
    }

    matches.sort((a, b) => b.score - a.score);

    const top = matches[0];

    const search = `${top.name} prototype Apple device EVT`;

    setResults([
      {
        ...top,
        links: {
          ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(search)}`,
          mercari: `https://www.mercari.com/search/?keyword=${encodeURIComponent(search)}`,
          goofish: `https://www.goofish.com/search?q=${encodeURIComponent(search)}`
        }
      }
    ]);

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Prototype Visual Matcher (Stable)</h1>

      <h3>Query Image</h3>
      <input type="file" accept="image/*" onChange={(e) => setQuery(e.target.files[0])} />

      <h3>Database Images</h3>
      <input type="file" multiple accept="image/*" onChange={(e) => setDb(e.target.files)} />

      <br /><br />

      <button onClick={runScan}>
        {loading ? "Scanning..." : "Run Match"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img src={r.image} width="80" />
            <h3>{r.name}</h3>
            <p>{r.score}% match</p>

            <a href={r.links.ebay}>eBay</a> |{" "}
            <a href={r.links.mercari}>Mercari</a> |{" "}
            <a href={r.links.goofish}>Goofish</a>
          </div>
        ))}
      </div>
    </div>
  );
}
