import { useState, useMemo } from "react"

const DATABASE = [
  {
    id: 1,
    name: "iPhone 2G Prototype EVT",
    tags: ["iphone", "prototype", "evt"],
    imageHint: "iphone early prototype"
  },
  {
    id: 2,
    name: "iPod Touch Engineering Sample",
    tags: ["ipod", "touch", "dvt"],
    imageHint: "ipod prototype"
  },
  {
    id: 3,
    name: "MacBook Unibody EVT Unit",
    tags: ["macbook", "prototype", "aluminum"],
    imageHint: "macbook prototype"
  }
]

function fakeScore(input, item) {
  const text = input.toLowerCase()
  let score = 0

  item.tags.forEach(tag => {
    if (text.includes(tag)) score += 40
  })

  if (text.length > 0 && item.name.toLowerCase().includes(text)) {
    score += 30
  }

  return Math.min(score, 99)
}

export default function App() {
  const [image, setImage] = useState(null)
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query && !image) return []

    return DATABASE
      .map(item => ({
        ...item,
        score: fakeScore(query, item)
      }))
      .sort((a, b) => b.score - a.score)
  }, [query, image])

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 900, margin: "0 auto" }}>
      <h1>Prototype Image Matcher</h1>

      {/* Upload (simulated for now) */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        placeholder="Describe image (e.g. iphone prototype EVT)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          marginBottom: 20
        }}
      />

      <div style={{ display: "grid", gap: 10 }}>
        {results.map(item => (
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
