// Run: node generator.js
// Generates 250 product objects and writes frontend_products.json

const fs = require('fs');
const path = require('path');

const COUNT = 250;
const categories = ['electronics','clothing','home','books','beauty','toys','sports','garden','kitchen','accessories'];

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rndFloat(min, max, decimals = 2) {
  const p = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * p) / p;
}

function makeName(idx) {
  const adjectives = ['Advanced','Modern','Portable','Premium','Classic','Smart','Compact','Eco','Deluxe','Ultimate'];
  const items = ['Headphones','Jacket','Blender','Lamp','Backpack','Sneakers','Watch','Mug','Sofa Pillow','Action Figure','Yoga Mat','Garden Hose','Cookware Set'];
  const a = adjectives[idx % adjectives.length];
  const i = items[idx % items.length];
  return `${a} ${i} ${idx + 1}`;
}

function makeDescription(idx) {
  return `High-quality ${makeName(idx)}. Great value, reliable performance, and excellent build quality. Perfect for everyday use.`;
}

function makeProduct(i) {
  const id = `prod-${String(i + 1).padStart(4, '0')}`;
  const name = makeName(i);
  const price = rndFloat(5, 499, 2);
  const stock = rnd(0, 120);
  const category = categories[i % categories.length];
  const image = `https://picsum.photos/seed/${encodeURIComponent(id)}/600/600`;
  const description = makeDescription(i);
  const rating = rndFloat(2.5, 5.0, 1);
  // minimal product schema - adapt fields as needed by your backend
  return {
    _id: id,
    name,
    description,
    price,
    image,
    stock,
    category,
    rating,
    createdAt: new Date().toISOString()
  };
}

function generate(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(makeProduct(i));
  }
  return arr;
}

const products = generate(COUNT);
const outPath = path.join(__dirname, 'frontend_products.json');
fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Wrote ${products.length} products to ${outPath}`);
