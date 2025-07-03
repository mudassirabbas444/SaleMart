import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton';
import ProductCard from '../components/ProductCard';
import DatabaseService from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00'];

  const reviews = [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent product! Great quality and fast delivery.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    },
    {
      id: 2,
      user: 'John D.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good product, but shipping took longer than expected.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    },
    {
      id: 3,
      user: 'Emily R.',
      rating: 5,
      date: '2024-01-08',
      comment: 'Perfect! Exactly what I was looking for.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
  ];

  // Load related products and check wishlist status
  useEffect(() => {
    loadRelatedProducts();
    checkWishlistStatus();
  }, [product]);

  const loadRelatedProducts = async () => {
    try {
      const products = await DatabaseService.getProductsByCategory(product.category, 5);
      // Filter out the current product
      const filtered = products.filter(p => p.id !== product.id);
      setRelatedProducts(filtered.slice(0, 3)); // Show max 3 related products
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user) return;
    
    try {
      const wishlist = await DatabaseService.getUserWishlist(user.uid);
      const isInWishlist = wishlist.some(item => item.productId === product.id);
      setIsWishlisted(isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }
    
    Alert.alert(
      'Add to Cart',
      `Add ${quantity} ${product.name} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Cart', 
          onPress: () => {
            Alert.alert('Success', 'Product added to cart!');
            navigation.navigate('Cart');
          }
        }
      ]
    );
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }
    
    navigation.navigate('Checkout', { 
      cartItems: [{ ...product, quantity }] 
    });
  };

  const handleWishlist = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add items to your wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const wishlist = await DatabaseService.getUserWishlist(user.uid);
        const wishlistItem = wishlist.find(item => item.productId === product.id);
        if (wishlistItem) {
          await DatabaseService.removeFromWishlist(wishlistItem.id);
          setIsWishlisted(false);
          Alert.alert('Success', 'Product removed from wishlist');
        }
      } else {
        // Add to wishlist
        await DatabaseService.addToWishlist(user.uid, product.id);
        setIsWishlisted(true);
        Alert.alert('Success', 'Product added to wishlist');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
      console.error('Error updating wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would be implemented here.');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <MaterialIcons
        key={index}
        name={index < rating ? "star" : "star-border"}
        size={16}
        color={index < rating ? "#f39c12" : "#ccc"}
      />
    ));
  };

  const renderReview = (review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewUser}>{review.user}</Text>
          <View style={styles.reviewRating}>
            {renderStars(review.rating)}
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent']}
            style={styles.imageOverlay}
          >
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleShare}
                >
                  <MaterialIcons name="share" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleWishlist}
                >
                  <MaterialIcons 
                    name={isWishlisted ? "favorite" : "favorite-border"} 
                    size={24} 
                    color={isWishlisted ? "#e74c3c" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.productRating}>
              {renderStars(product.rating)}
              <Text style={styles.ratingText}>({product.reviews})</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            {product.originalPrice > product.price && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.stockStatus}>
            <MaterialIcons 
              name={product.inStock ? "check-circle" : "cancel"} 
              size={20} 
              color={product.inStock ? "#27ae60" : "#e74c3c"} 
            />
            <Text style={[styles.stockText, { color: product.inStock ? "#27ae60" : "#e74c3c" }]}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>

          {/* Size Selection */}
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>Size</Text>
            <View style={styles.sizeContainer}>
              {sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSizeButton
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>Color</Text>
            <View style={styles.colorContainer}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorButton
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialIcons name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selection */}
          <View style={styles.selectionSection}>
            <Text style={styles.selectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <MaterialIcons name="remove" size={20} color="#667eea" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <MaterialIcons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              This premium product offers exceptional quality and performance. 
              Designed with the latest technology and built to last, it provides 
              an outstanding user experience. Perfect for both personal and 
              professional use.
            </Text>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {reviews.map(renderReview)}
          </View>

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Related Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map(relatedProduct => (
                <View key={relatedProduct.id} style={styles.relatedProduct}>
                  <ProductCard
                    product={relatedProduct}
                    onPress={() => navigation.push('ProductDetail', { product: relatedProduct })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <CustomButton
            title="Add to Cart"
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            disabled={!product.inStock}
          />
          <CustomButton
            title="Buy Now"
            onPress={handleBuyNow}
            style={styles.buyNowButton}
            disabled={!product.inStock}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  productInfo: {
    padding: 20,
  },
  productHeader: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: 'row',
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedSizeButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedSizeText: {
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: '#667eea',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  relatedSection: {
    marginBottom: 100,
  },
  relatedProduct: {
    width: 200,
    marginRight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  addToCartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  buyNowButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ProductDetailScreen; 