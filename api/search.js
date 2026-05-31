import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const html = await response.text();

    const $ = cheerio.load(html);

    let results = [];

    $(".s-item").each((i, el) => {
      const title = $(el).find(".s-item__title").text();
      const link = $(el).find("a.s-item__link").attr("href");
      const image = $(el).find(".s-item__image-img").attr("src");
      const price = $(el).find(".s-item__price").text();

      if (title && link && title !== "Shop on eBay") {
        results.push({
          title,
          url: link,
          image: image || "",
          price: price || "N/A"
        });
      }
    });

    res.status(200).json({
      results: results.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: "Scraper failed" });
  }
}
