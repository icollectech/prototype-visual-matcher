import { useState } from "react"

const PROTOTYPES = [
  {
    id: 1,
    name: "iPhone 2G Prototype",
    year: 2006,
    status: "Early Dev Unit",
    notes: "Pre-release hardware, debug OS build"
  },
  {
    id: 2,
    name: "iPhone 3G EVT Unit",
    year: 2007,
    status: "Engineering Validation",
    notes: "Used for carrier testing and hardware validation"
  },
  {
    id: 3,
    name: "iPod Touch DVT Prototype",
    year: 2007,
    status: "Design Validation",
    notes: "Early multitouch testing hardware"
  },
  {
    id: 4,
    name: "MacBook Unibody EVT",
    year: 2008,
    status: "Engineering Prototype",
    notes: "Pre-production aluminum unibody design test"
  }
]

export default function App() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)

  const filtered = PROTOTYPES.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "Arial", padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Prototype Visual Matcher</h1>

      {/* Search */}
      <input
        placeholder="Search prototypes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          marginBottom: 20
        }}
      />

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 15
      }}>
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              cursor: "pointer"
            }}
          >
            <h3>{item.name}</h3>
            <p>{item.year}</p>
            <small>{item.status}</small>
          </div>
        ))}
      </div>

      {/* Modal / Detail View */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 12,
              width: 400
            }}
          >
            <h2>{selected.name}</h2>
            <p><b>Year:</b> {selected.year}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p>{selected.notes}</p>

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: 10,
                padding: 10,
                width: "100%",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
