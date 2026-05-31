import { useState } from "react";

function extractSimpleFeatures(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 10;
      canvas.height = 10;

      ctx.drawImage(img, 0, 0, 10, 10);

      const data = ctx.getImageData(0, 0, 10, 10).data;

      let brightness = 0;

      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }

      brightness = brightness / (data.length / 4);

      resolve({ brightness });
    };
  });
}

function classifyIntent({ brightness }) {
  // VERY simple heuristic “AI”
  if (brightness < 80) return "iphone motherboard prototype";
  if (brightness < 120) return "iphone parts teardown";
  if (brightness < 160) return "apple device internal components";
  return "smartphone device housing";
}

export default function App() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    if (!image) return alert("Upload an image");

    setLoading(true);

    const features = await extractSimpleFeatures(image);
    const query = classifyIntent(features);

    const ebay = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
    const mercari = `https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`;
    const goofish = `https://www.goofish.com/search?q=${encodeURIComponent(query)}`;

    setResults([
      {
        title: query,
        ebay,
        mercari,
        goofish
      }
    ]);

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🧠 Marketplace AI Scanner</h1>

      <p>Upload 1 image → get marketplace matches</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button onClick={runScan}>
        {loading ? "Scanning..." : "Scan Marketplaces"}
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <h3>Search: {r.title}</h3>

            <ul>
              <li>
                <a href={r.ebay} target="_blank">eBay results</a>
              </li>
              <li>
                <a href={r.mercari} target="_blank">Mercari results</a>
              </li>
              <li>
                <a href={r.goofish} target="_blank">Goofish results</a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
      
