// Script to seed sample products into Firebase
// Run this script to add sample products to your Firestore database

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOKYKj2q9H2V8wtEXcEixlMRT5YJSCYn4",
  authDomain: "ecommerce-a886e.firebaseapp.com",
  projectId: "ecommerce-a886e",
  storageBucket: "ecommerce-a886e.firebasestorage.app",
  messagingSenderId: "390387886796",
  appId: "1:390387886796:web:84b539f6d095557a43b069",
  measurementId: "G-H3LC676H47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: "High-quality wireless headphones with noise cancellation and long battery life.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Electronics",
    rating: 4.7,
    reviews: 256,
    inStock: true,
    description: "Advanced fitness tracking with heart rate monitoring and GPS.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Premium Coffee Maker",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    category: "Home & Garden",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    description: "Professional coffee maker with programmable settings and thermal carafe.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Running Shoes",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Sports & Outdoors",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    description: "Comfortable running shoes with excellent cushioning and support.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    category: "Electronics",
    rating: 4.3,
    reviews: 98,
    inStock: false,
    description: "Waterproof portable speaker with 20-hour battery life.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Designer Handbag",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    category: "Fashion",
    rating: 4.8,
    reviews: 203,
    inStock: true,
    description: "Luxury leather handbag with multiple compartments and elegant design.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Gaming Laptop",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    category: "Electronics",
    rating: 4.9,
    reviews: 342,
    inStock: true,
    description: "High-performance gaming laptop with RTX graphics and 16GB RAM.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Yoga Mat",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "Sports & Outdoors",
    rating: 4.2,
    reviews: 89,
    inStock: true,
    description: "Non-slip yoga mat made from eco-friendly materials.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kitchen Knife Set",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400",
    category: "Home & Garden",
    rating: 4.7,
    reviews: 167,
    inStock: true,
    description: "Professional knife set with wooden block and sharpener.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Wireless Earbuds",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    category: "Electronics",
    rating: 4.1,
    reviews: 234,
    inStock: true,
    description: "True wireless earbuds with active noise cancellation.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('Successfully seeded all products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Run the seeding function
seedProducts(); 