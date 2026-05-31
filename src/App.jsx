import { useState } from "react"

const PROTOTYPES = [
  { id: 1, name: "iPhone 2G Prototype", year: 2006, status: "EVT" },
  { id: 2, name: "iPhone 3G EVT", year: 2007, status: "EVT" },
  { id: 3, name: "iPod Touch DVT", year: 2007, status: "DVT" }
]

export default function App() {
  const [search, setSearch] = useState("")

  const filtered = PROTOTYPES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Prototype Visual Matcher</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 20 }}
      />

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            border: "1px solid #ccc",
            padding: 10,
            borderRadius: 8
          }}>
            <b>{item.name}</b>
            <div>{item.year}</div>
            <small>{item.status}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
