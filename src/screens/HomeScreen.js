import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import DatabaseService from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load products and categories from Firebase
  useEffect(() => {
    loadProducts();
    loadCategories();
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await DatabaseService.getProducts(20);
      setProducts(productsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // For now, we'll use static categories since we don't have a categories collection
      // In a real app, you'd fetch categories from Firebase
      const staticCategories = [
        { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', productCount: 156, color: '#667eea' },
        { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', productCount: 234, color: '#e74c3c' },
        { id: 3, name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', productCount: 189, color: '#27ae60' },
        { id: 4, name: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', productCount: 98, color: '#f39c12' },
      ];
      setCategories(staticCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const wishlistData = await DatabaseService.getUserWishlist(user.uid);
      const wishlistIds = wishlistData.map(item => item.productId);
      setWishlist(wishlistIds);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const handleWishlist = async (productId) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add items to your wishlist');
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        const wishlistData = await DatabaseService.getUserWishlist(user.uid);
        const wishlistItem = wishlistData.find(item => item.productId === productId);
        if (wishlistItem) {
          await DatabaseService.removeFromWishlist(wishlistItem.id);
          setWishlist(wishlist.filter(id => id !== productId));
        }
      } else {
        // Add to wishlist
        await DatabaseService.addToWishlist(user.uid, productId);
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
      console.error('Error updating wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory.name;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hello, {userProfile?.fullName || user?.displayName || 'User'}!
            </Text>
            <Text style={styles.subtitle}>What are you looking for today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category)}
                isSelected={selectedCategory?.id === category.id}
              />
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredProducts.map(product => (
              <View key={product.id} style={styles.featuredItem}>
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                  onWishlist={() => handleWishlist(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  isWishlisted={wishlist.includes(product.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* All Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? selectedCategory.name : 'All Products'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.seeAllText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetail', { product })}
              onWishlist={() => handleWishlist(product.id)}
              onAddToCart={() => handleAddToCart(product)}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuredContainer: {
    paddingRight: 20,
  },
  featuredItem: {
    width: 280,
    marginRight: 16,
  },
});

export default HomeScreen; 