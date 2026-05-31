import { useState, useMemo } from "react"

const DATABASE = [
  { name: "iPhone 2G Prototype EVT", match: 95 },
  { name: "Apple Engineering Sample Device", match: 88 },
  { name: "MacBook Prototype Unit", match: 81 },
  { name: "iPod Touch DVT Prototype", match: 78 }
]

function scoreMatch(query, item) {
  const q = query.toLowerCase()
  const n = item.name.toLowerCase()

  let score = 0

  if (!q) return 0

  if (n.includes("iphone") && q.includes("iphone")) score += 40
  if (n.includes("macbook") && q.includes("macbook")) score += 40
  if (n.includes("ipod") && q.includes("ipod")) score += 40

  if (n.includes("prototype") && q.includes("prototype")) score += 30
  if (n.includes("evt") && q.includes("evt")) score += 20

  return Math.min(score, 99)
}

export default function App() {
  const [image, setImage] = useState(null)
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    return DATABASE
      .map(item => ({
        ...item,
        match: scoreMatch(query, item)
      }))
      .sort((a, b) => b.match - a.match)
  }, [query])

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "0 auto" }}>
      <h1>AI Image Matcher (Prototype)</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {image && (
        <div style={{ marginTop: 10 }}>
          <p>Uploaded Image:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="upload"
            style={{ width: 200, borderRadius: 10 }}
          />
        </div>
      )}

      <input
        placeholder="Describe image (iphone prototype, macbook EVT...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 15,
          marginBottom: 20
        }}
      />

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
            <div>Match: {item.match}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
