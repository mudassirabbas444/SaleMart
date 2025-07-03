import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import DatabaseService from '../services/databaseService';

const CategoriesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      productCount: 156,
      color: '#667eea',
    },
    {
      id: 2,
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      productCount: 234,
      color: '#e74c3c',
    },
    {
      id: 3,
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      productCount: 189,
      color: '#27ae60',
    },
    {
      id: 4,
      name: 'Sports & Outdoors',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      productCount: 98,
      color: '#f39c12',
    },
    {
      id: 5,
      name: 'Books & Media',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      productCount: 312,
      color: '#9b59b6',
    },
    {
      id: 6,
      name: 'Health & Beauty',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      productCount: 145,
      color: '#e91e63',
    },
    {
      id: 7,
      name: 'Toys & Games',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      productCount: 87,
      color: '#ff9800',
    },
    {
      id: 8,
      name: 'Automotive',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
      productCount: 67,
      color: '#607d8b',
    },
  ];

  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await DatabaseService.getProducts(50);
      setProducts(productsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (categoryName) => {
    setLoading(true);
    try {
      const productsData = await DatabaseService.getProductsByCategory(categoryName, 50);
      setProducts(productsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products for this category');
      console.error('Error loading products by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }
    
    setLoading(true);
    try {
      const productsData = await DatabaseService.searchProducts(query, 50);
      setProducts(productsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to search products');
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory.name)
    : products;

  const searchedProducts = searchQuery
    ? filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts;

  const handleCategoryPress = (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      loadProducts();
    } else {
      setSelectedCategory(category);
      loadProductsByCategory(category.name);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    loadProducts();
  };

  const renderCategoryItem = ({ item }) => (
    <CategoryCard
      category={item}
      onPress={() => handleCategoryPress(item)}
      isSelected={selectedCategory?.id === item.id}
    />
  );

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      viewMode={viewMode}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse by category</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products or categories..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchProducts(text);
              }}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <View style={styles.filterContainer}>
            <View style={styles.activeFilters}>
              {selectedCategory && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterText}>{selectedCategory.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {searchQuery && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterText}>"{searchQuery}"</Text>
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories Grid */}
        {!selectedCategory && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>All Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoriesGrid}
            />
          </View>
        )}

        {/* Products Section */}
        {selectedCategory && (
          <View style={styles.productsSection}>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory.name} ({searchedProducts.length})
              </Text>
              <View style={styles.viewModeToggle}>
                <TouchableOpacity
                  style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode]}
                  onPress={() => setViewMode('grid')}
                >
                  <MaterialIcons 
                    name="grid-view" 
                    size={20} 
                    color={viewMode === 'grid' ? '#667eea' : '#666'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
                  onPress={() => setViewMode('list')}
                >
                  <MaterialIcons 
                    name="view-list" 
                    size={20} 
                    color={viewMode === 'list' ? '#667eea' : '#666'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            {viewMode === 'grid' ? (
              <FlatList
                data={searchedProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsGrid}
                key="grid"
              />
            ) : (
              <FlatList
                data={searchedProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsGrid}
                key="list"
              />
            )}
          </View>
        )}

        {/* Search Results */}
        {!selectedCategory && searchQuery && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchedProducts.length})
            </Text>
            <FlatList
              data={searchedProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsGrid}
            />
          </View>
        )}
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginTop: -15,
    marginBottom: 20,
  },
  searchBar: {
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
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  filterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    flex: 1,
  },
  productsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: '#f0f0f0',
  },
  categoriesGrid: {
    paddingBottom: 20,
  },
  productsGrid: {
    paddingBottom: 20,
  },
});

export default CategoriesScreen; 