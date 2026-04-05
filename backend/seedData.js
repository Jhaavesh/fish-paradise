require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const seeds = [
  { name:'Custom Glass Tank 3ft', category:'Fish Tanks', price:8500, unit:'unit', badge:'New', featured:true, stock:10, imageUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70', description:'Premium custom glass aquarium tank, 3 feet with silicone seal and full hood.' },
  { name:'Canister Filter Pro 1200L', category:'Filters', price:3200, unit:'unit', badge:'Popular', featured:true, stock:15, imageUrl:'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=70', description:'High-performance canister filter for tanks up to 1200 litres.' },
  { name:'LED Spectrum Light 60cm', category:'Lights', price:1800, unit:'unit', badge:'', featured:true, stock:25, imageUrl:'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=70', description:'Full spectrum LED for planted and reef tanks.' },
  { name:'Live Plant Bundle Pack', category:'Plants', price:650, unit:'pack', badge:'Best Seller', featured:true, stock:30, imageUrl:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=70', description:'Assorted live aquatic plants for beautiful aquascaping.' },
  { name:'Premium Fish Food 500g', category:'Fish Food', price:350, unit:'pack', badge:'', featured:false, stock:50, imageUrl:'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&q=70', description:'Nutritionally complete food for all tropical fish.' },
  { name:'Driftwood Decor Set', category:'Decorations', price:1200, unit:'set', badge:'', featured:false, stock:12, imageUrl:'https://images.unsplash.com/photo-1621181483028-5f8b4a3d58c8?w=400&q=70', description:'Natural driftwood pieces for aquascape decoration.' },
  { name:'Custom Glass Tank 5ft', category:'Fish Tanks', price:18000, unit:'unit', badge:'', featured:false, stock:5, imageUrl:'https://images.unsplash.com/photo-1596550944968-6a2ad5a7b0f4?w=400&q=70', description:'Extra large 5ft glass aquarium for commercial spaces.' },
  { name:'Planted Tank Setup Kit', category:'Plants', price:2500, unit:'kit', badge:'Sale', featured:false, stock:8, imageUrl:'https://images.unsplash.com/photo-1601460085826-4c5a39a8c7d6?w=400&q=70', description:'Complete kit with substrate, plants and CO2 system.' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  const created = await Product.insertMany(seeds);
  console.log('✅ Seeded', created.length, 'products');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
