import { useState } from "react";

/**
 * ----------------------------
 * SIMPLE IMAGE → TEXT SIGNAL
 * (no APIs, no backend)
 * ----------------------------
 */

function extractQuery(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, "");

  // clean junk names
  const cleaned = base
    .replace(/IMG|DSC|Screenshot|photo|image|file|capture/gi, "")
    .replace(/[_-]/g, " ")
    .trim();

  // collector enrichment keywords
  return `${cleaned} prototype EVT DVT Apple device`;
}

/**
 * ----------------------------
 * MARKETPLACE SCAN LINKS
 * ----------------------------
 */

function buildScanLinks(query) {
  return {
    ebayAll: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
    ebaySold: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Complete=1&LH_Sold=1`,
    mercari: `https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`,
    goofish: `https://www.goofish.com/search?q=${encodeURIComponent(query)}`
  };
}

export default function App() {
  const [image, setImage] = useState(null);
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  function runScan() {
    if (!image) {
      alert("Upload an image first");
      return;
    }

    setLoading(true);

    const query = extractQuery(image.name);
    const links = buildScanLinks(query);

    setScan({
      query,
      preview: URL.createObjectURL(image),
      links
    });

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🧠 Prototype Marketplace Scanner</h1>

      <p>Upload 1 image → instantly scan marketplaces</p>

      {/* INPUT */}
      <input type="file" accept="image/*" onChange={handleImage} />

      <br /><br />

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
        {loading ? "Scanning..." : "Scan Marketplaces"}
      </button>

      {/* RESULTS */}
      {scan && (
        <div style={{ marginTop: 30 }}>
          <h2>Scan Result</h2>

          <div style={{ display: "flex", gap: 12 }}>
            <img
              src={scan.preview}
              alt=""
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8
              }}
            />

            <div>
              <p><b>Search Query:</b></p>
              <p>{scan.query}</p>
            </div>
          </div>

          <h3 style={{ marginTop: 20 }}>Marketplace Scan</h3>

          <ul>
            <li>
              <a href={scan.links.ebayAll} target="_blank">
                eBay Active Listings
              </a>
            </li>

            <li>
              <a href={scan.links.ebaySold} target="_blank">
                eBay Sold Prices
              </a>
            </li>

            <li>
              <a href={scan.links.mercari} target="_blank">
                Mercari Results
              </a>
            </li>

            <li>
              <a href={scan.links.goofish} target="_blank">
                Goofish Results
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
