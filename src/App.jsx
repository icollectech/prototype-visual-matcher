import { useState } from "react"

export default function App() {
  const [image, setImage] = useState(null)
  const [query, setQuery] = useState("")

  // fake results (placeholder for future AI)
  const results = [
    { name: "iPhone 2G Prototype EVT", match: "92%" },
    { name: "iPod Touch Engineering Unit", match: "86%" },
    { name: "MacBook Prototype EVT", match: "79%" }
  ]

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "0 auto" }}>
      <h1>Image Matcher</h1>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {/* Preview */}
      {image && (
        <div style={{ marginTop: 15 }}>
          <p>Uploaded:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="upload"
            style={{ width: 200, borderRadius: 10 }}
          />
        </div>
      )}

      {/* Optional search text */}
      <input
        placeholder="Describe image (optional)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 15,
          marginBottom: 20
        }}
      />

      {/* Results */}
      <h3>Matches</h3>

      <div style={{ display: "grid", gap: 10 }}>
        {results.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              borderRadius: 10
            }}
          >
            <b>{item.name}</b>
            <div>Match: {item.match}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
