require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const seeds = [
  { name:'Custom Glass Tank 3ft', category:'Fish Tanks', price:1, unit:'unit', badge:'New', featured:true, stock:10, imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbHm8q0Awtqx4NVU8tZNDgyXjaSqAirytovQ&s', description:'Premium custom glass aquarium tank, 3 feet with silicone seal and full hood.' },

  { name:'Canister Filter Pro 1200L', category:'Filters', price:3200, unit:'unit', badge:'Popular', featured:true, stock:15, imageUrl:'https://rukminim2.flixcart.com/image/1536/1536/xif0q/aquarium-filter/m/a/w/120-ybf-500f-finypetz-original-imahhgn4b89pygfd.jpeg?q=90', description:'High-performance canister filter for tanks up to 1200 litres.' },

  { name:'LED Spectrum Light 60cm', category:'Lights', price:1800, unit:'unit', badge:'', featured:true, stock:25, imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJWEETZ08JnQViBXhIslSEiZDDN3xrSxt4iw&s', description:'Full spectrum LED for planted and reef tanks.' },

  { name:'Live Plant Bundle Pack', category:'Plants', price:650, unit:'pack', badge:'Best Seller', featured:true, stock:30, imageUrl:'https://m.media-amazon.com/images/I/61DLuE4eIJL._AC_UF1000,1000_QL80_.jpg', description:'Assorted live aquatic plants for beautiful aquascaping.' },

  { name:'Premium Fish Food 500g', category:'Fish Food', price:350, unit:'pack', badge:'', featured:false, stock:50, imageUrl:'https://m.media-amazon.com/images/I/51qTVWaWYmL._AC_UF350,350_QL80_.jpg', description:'Nutritionally complete food for all tropical fish.' },

  { name:'Driftwood Decor Set', category:'Decorations', price:1200, unit:'set', badge:'', featured:false, stock:12, imageUrl:'https://cdn.shopify.com/s/files/1/0670/6767/4814/files/Spider_Wood_-_XL___5-PACK_1.jpg?v=1762267293', description:'Natural driftwood pieces for aquascape decoration.' },

  { name:'Custom Glass Tank 5ft', category:'Fish Tanks', price:18000, unit:'unit', badge:'', featured:false, stock:5, imageUrl:'https://glasscogroup.in/glasscodashboard/upload/f8164cbc4102346d57e333f936d1cf1f.jpg', description:'Extra large 5ft glass aquarium for commercial spaces.' },

  { name:'Planted Tank Setup Kit', category:'Plants', price:2500, unit:'kit', badge:'Sale', featured:false, stock:8, imageUrl:'https://cdn.shopify.com/s/files/1/0311/3149/files/beginner_planted_aquarium.jpg?v=1606333329', description:'Complete kit with substrate, plants and CO2 system.' },

  // ✅ 🔥 LIVE FISH ADDED (IMPORTANT)
  { name:'Goldfish', category:'Live Fish', price:150, unit:'piece', badge:'Popular', featured:true, stock:40, imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhmEeKJ6tWYkj4SZvUY7Y5FdkIETwTTPFPrA&s', description:'Beautiful beginner-friendly goldfish.' },

  { name:'Guppy', category:'Live Fish', price:80, unit:'pair', badge:'', featured:false, stock:60, imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROdqZ_04mIJ1ScpkjoHMxkJC8gZeW-ZlHSMg&s', description:'Colorful guppy fish, ideal for small tanks.' },

  { name:'Betta', category:'Live Fish', price:250, unit:'piece', badge:'Best Seller', featured:true, stock:25, imageUrl:'https://upload.wikimedia.org/wikipedia/commons/1/10/HM_Orange_M_Sarawut.jpg', description:'Premium betta fish with vibrant colors.' },

  { name:'Arowana', category:'Live Fish', price:15000, unit:'piece', badge:'', featured:true, stock:5, imageUrl:'https://upload.wikimedia.org/wikipedia/commons/b/bf/Osteoglossum_bicirrhosum.JPG', description:'Exotic arowana fish for luxury aquariums.' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  const created = await Product.insertMany(seeds);
  console.log('✅ Seeded', created.length, 'products');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });