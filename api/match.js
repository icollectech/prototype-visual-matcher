export default async function handler(req, res) {
  const { image } = req.body

  // fake AI results (we’ll upgrade later)
  const results = [
    { name: "iPhone 2G Prototype EVT", match: 95 },
    { name: "iPod Touch Engineering Unit", match: 87 },
    { name: "MacBook Prototype EVT", match: 81 }
  ]

  res.status(200).json({ results })
}
