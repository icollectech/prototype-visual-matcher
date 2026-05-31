import { useState, useMemo } from "react"

const DATABASE = [
  {
    id: 1,
    name: "iPhone 2G Prototype EVT",
    tags: ["iphone", "prototype", "evt"],
  },
  {
    id: 2,
    name: "iPod Touch Engineering Sample",
    tags: ["ipod", "touch", "dvt"],
  },
  {
    id: 3,
    name: "MacBook Unibody EVT Unit",
    tags: ["macbook", "prototype", "aluminum"],
  },
  {
    id: 4,
    name: "Apple Internal Test iPhone",
    tags: ["iphone", "internal", "test"],
  }
]

// “AI-style embedding” (no API keys, simulates real vector matching)
function embed(text) {
  const map = {
    iphone: 2,
    ipod: 3,
    macbook: 4,
    prototype: 5,
    evt: 6,
    dvt: 7,
    internal: 8,
    aluminum: 9,
    test: 10
  }

  let score = 0

  Object.keys(map).forEach((key) => {
    if (text.toLowerCase().includes(key)) {
      score += map[key]
    }
  })

  return score
}

function similarityScore(input, item) {
  const a = embed(input)
  const b = embed(item.name + " " + item.tags.join(" "))

  const diff = Math.abs(a - b)
  const score = Math.max(0, 100 - diff * 10)

  return Math.round(score)
}

export default function App() {
  const [query, setQuery] = useState("")
  const [image, setImage] = useState(null)

  const results = useMemo(() => {
    if (!query && !image) return []

    return DATABASE
      .map((item) => ({
        ...item,
        score: similarityScore(query, item)
      }))
      .sort((a, b) => b.score - a.score)
  }, [query, image])

  return (
    <div style={{
      padding: 20,
      fontFamily: "Arial",
      maxWidth: 900,
      margin: "0 auto"
    }}>
      <h1>Prototype Visual Matcher</h1>

      {/* Upload (placeholder for real image AI later) */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        placeholder="Describe or tag image (iphone prototype EVT...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10,
          marginBottom: 20
        }}
      />

      <div style={{ display: "grid", gap: 12 }}>
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              borderRadius: 10
            }}
          >
            <b>{item.name}</b>
            <div>Match Score: {item.score}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
