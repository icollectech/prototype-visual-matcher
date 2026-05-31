import { useState } from "react"

export default function App() {
  const [image, setImage] = useState(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([
    { name: "iPhone 2G Prototype EVT", match: 95 },
    { name: "Apple Engineering Sample", match: 88 },
    { name: "MacBook Prototype Unit", match: 81 }
  ])

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800 }}>
      <h1>Image Matcher</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="upload"
          style={{ width: 200, marginTop: 10 }}
        />
      )}

      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 15 }}
      />

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <div key={i} style={{ padding: 10, border: "1px solid #ddd" }}>
            <b>{r.name}</b>
            <div>{r.match}% match</div>
          </div>
        ))}
      </div>
    </div>
  )
}
