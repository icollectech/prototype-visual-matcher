export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;

  res.status(200).json({
    results: [
      {
        title: query,
        url,
        image: "https://via.placeholder.com/150"
      }
    ]
  });
}
