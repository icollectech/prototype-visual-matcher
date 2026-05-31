const fs = require("fs");
const path = require("path");

const datasetFolder = path.join(process.cwd(), "dataset");

const files = fs.readdirSync(datasetFolder);

const imageFiles = files.filter(file =>
  /\.(jpg|jpeg|png|webp)$/i.test(file)
);

const urls = imageFiles.map(file => ({
  file,
  title: file
    .replace(/\.[^/.]+$/, "")
    .replace(/_/g, " "),
  url: "https://www.ebay.com"
}));

fs.writeFileSync(
  "urls.json",
  JSON.stringify(urls, null, 2)
);

console.log(`DONE ✔ Created urls.json with ${urls.length} images`);
