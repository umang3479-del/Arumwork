// MOCK DATABASE & SEEDER
const DB = (() => {
  const categories = {
    women: ['Fashion', 'Jewellery', 'Heels'],
    men: ['Fashion', 'Pant', 'Shoes']
  };

  const images = {
    women_Fashion: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1515347619252-1f4d9c72df8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    women_Jewellery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1515562141207-7a8ef7fb3bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1599643478524-fb524c084e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    women_Heels: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    men_Fashion: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    men_Pant: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    men_Shoes: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ]
  };

  const adjectives = ['Premium', 'Classic', 'Modern', 'Stylish', 'Elegant', 'Casual', 'Trendy', 'Vintage', 'Comfortable'];
  
  let products = [];
  let idCounter = 1;

  for (const [mainCat, subCats] of Object.entries(categories)) {
    for (const subCat of subCats) {
      const imgKey = `${mainCat}_${subCat}`;
      const imgList = images[imgKey];
      
      // Generate 25 products per subcategory
      for (let i = 0; i < 25; i++) {
        const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${subCat.replace(/s$/, '')} Collection ${Math.floor(Math.random()*100)+1}`;
        const price = Math.floor(Math.random() * 4500) + 500; // 500 to 5000
        const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
        const reviews = Math.floor(Math.random() * 5000) + 10;
        
        products.push({
          id: idCounter++,
          title: title,
          category: mainCat,
          subCategory: subCat,
          price: price,
          rating: parseFloat(rating),
          reviews: reviews,
          image: imgList[i % imgList.length],
          description: `High-quality ${mainCat} ${subCat} product. Designed with comfort and style in mind. Available in assorted colors and sizes. Fits perfectly for all occasions. 100% authentic local material. Perfect for gifting.`,
          isFeatured: i < 4 // First 4 items are featured
        });
      }
    }
  }

  return {
    getProducts: () => products,
    getProductById: (id) => products.find(p => p.id === parseInt(id)),
    getRelatedProducts: (category, limit=4) => products.filter(p => p.category === category).slice(0, limit),
    search: (query) => {
      const q = query.toLowerCase();
      return products.filter(p => p.title.toLowerCase().includes(q) || p.subCategory.toLowerCase().includes(q));
    }
  };
})();
