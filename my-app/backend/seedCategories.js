const mongoose = require('mongoose');
const Category = require('./models/Category');

const categories = [
  { name: 'Cricket', description: 'Cricket related products' },
  { name: 'Badminton', description: 'Badminton related products' },
  { name: 'Football', description: 'Football related products' },
  { name: 'Tennis', description: 'Tennis related products' }
];
async function seedCategories() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (const category of categories) {
      const existing = await Category.findOne({ name: category.name });
      if (!existing) {
        await Category.create(category);
        console.log(`Category ${category.name} added.`);
      } else {
        console.log(`Category ${category.name} already exists.`);
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}
seedCategories();
