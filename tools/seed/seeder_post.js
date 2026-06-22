// Run: API_URL and optionally AUTH_TOKEN must be set in env.
// Example:
//   export API_URL="http://localhost:5000/api/products"
//   export AUTH_TOKEN="Bearer eyJ..."   # optional
//   node seeder_post.js
//
// The script will POST each product in frontend_products.json to API_URL.
// It waits a small delay between posts to avoid overloading the server.

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const FILE = path.join(__dirname, 'frontend_products.json');
if (!fs.existsSync(FILE)) {
  console.error(`File not found: ${FILE}. Run generator.js first.`);
  process.exit(1);
}

const API_URL = process.env.API_URL; // e.g. "http://localhost:5000/api/products"
const AUTH_TOKEN = process.env.AUTH_TOKEN; // optional authorization header value

if (!API_URL) {
  console.error('Please set API_URL environment variable to your product create endpoint (e.g. http://localhost:5000/api/products)');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(FILE, 'utf8'));

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postProduct(product) {
  try {
    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
      // add or adapt fields if your backend expects other names
    };

    const headers = {
      'Content-Type': 'application/json'
    };
    if (AUTH_TOKEN) headers['Authorization'] = AUTH_TOKEN;

    const res = await axios.post(API_URL, payload, { headers });
    console.log(`Created ${product._id} -> status ${res.status}`);
  } catch (err) {
    if (err.response) {
      console.error(`Failed ${product._id}: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    } else {
      console.error(`Failed ${product._id}: ${err.message}`);
    }
  }
}

(async () => {
  console.log(`Seeding ${products.length} products to ${API_URL}`);
  for (let i = 0; i < products.length; i++) {
    await postProduct(products[i]);
    // small delay; adjust as needed
    await sleep(150);
  }
  console.log('Done.');
})();
