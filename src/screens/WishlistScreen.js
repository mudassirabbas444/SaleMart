import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton';
import DatabaseService from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

const WishlistScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from Firebase
  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const wishlistData = await DatabaseService.getUserWishlist(user.uid);
      
      // Get product details for each wishlist item
      const productsWithDetails = await Promise.all(
        wishlistData.map(async (wishlistItem) => {
          try {
            const product = await DatabaseService.getProductById(wishlistItem.productId);
            return product ? { ...product, wishlistItemId: wishlistItem.id } : null;
          } catch (error) {
            console.error('Error fetching product:', error);
            return null;
          }
        })
      );

      // Filter out null products and set state
      const validProducts = productsWithDetails.filter(product => product !== null);
      setWishlistItems(validProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wishlist');
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.removeFromWishlist(item.wishlistItemId);
              setWishlistItems(wishlistItems.filter(wishlistItem => wishlistItem.id !== item.id));
              Alert.alert('Success', 'Item removed from wishlist');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove item from wishlist');
              console.error('Error removing from wishlist:', error);
            }
          }
        }
      ]
    );
  };

  const handleMoveToCart = (item) => {
    Alert.alert(
      'Move to Cart',
      `Add "${item.name}" to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Cart', 
          onPress: () => {
            setWishlistItems(wishlistItems.filter(wishlistItem => wishlistItem.id !== item.id));
            Alert.alert('Success', 'Item moved to cart!');
          }
        }
      ]
    );
  };

  const handleViewProduct = (item) => {
    // Navigate to product detail screen
    navigation.navigate('ProductDetail', { product: item });
  };

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Wishlist</Text>
        </LinearGradient>
        
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>Start adding products you love</Text>
          <CustomButton
            title="Start Shopping"
            onPress={() => navigation.navigate('Home')}
            style={styles.shopButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.itemCount}>{wishlistItems.length} items</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {wishlistItems.map(item => (
          <View key={item.id} style={styles.wishlistCard}>
            <TouchableOpacity 
              style={styles.productInfo}
              onPress={() => handleViewProduct(item)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color="#f39c12" />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.reviews}>({item.reviews})</Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  {item.originalPrice > item.price && (
                    <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                  )}
                </View>

                <View style={styles.stockContainer}>
                  <MaterialIcons 
                    name={item.inStock ? "check-circle" : "cancel"} 
                    size={16} 
                    color={item.inStock ? "#27ae60" : "#e74c3c"} 
                  />
                  <Text style={[styles.stockText, { color: item.inStock ? "#27ae60" : "#e74c3c" }]}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveFromWishlist(item)}
              >
                <MaterialIcons name="delete" size={20} color="#e74c3c" />
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>

              <CustomButton
                title="Move to Cart"
                onPress={() => handleMoveToCart(item)}
                disabled={!item.inStock}
                style={styles.moveToCartButton}
              />
            </View>
          </View>
        ))}
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
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemCount: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    width: 200,
  },
  wishlistCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemCategory: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 4,
  },
  moveToCartButton: {
    flex: 1,
    marginLeft: 12,
  },
});

export default WishlistScreen; 