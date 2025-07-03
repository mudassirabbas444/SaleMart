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
import DatabaseService from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load orders from Firebase
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await DatabaseService.getOrdersByUser(user.uid);
      setOrders(ordersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#27ae60';
      case 'Shipped':
        return '#3498db';
      case 'Processing':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return 'check-circle';
      case 'Shipped':
        return 'local-shipping';
      case 'Processing':
        return 'hourglass-empty';
      default:
        return 'info';
    }
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  const handleTrackOrder = (order) => {
    Alert.alert(
      'Track Order',
      `Tracking Number: ${order.trackingNumber}\n\nTrack your package at: tracking.example.com`,
      [{ text: 'OK' }]
    );
  };

  const handleReorder = (order) => {
    Alert.alert(
      'Reorder',
      'Add all items from this order to your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

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
        <Text style={styles.title}>My Orders</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <TouchableOpacity 
              style={styles.orderHeader}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.7}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderStatus}>
                <MaterialIcons 
                  name={getStatusIcon(order.status)} 
                  size={20} 
                  color={getStatusColor(order.status)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
              <MaterialIcons 
                name={selectedOrder?.id === order.id ? "expand-less" : "expand-more"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>

            {selectedOrder?.id === order.id && (
              <View style={styles.orderDetails}>
                {/* Order Items */}
                <View style={styles.itemsSection}>
                  <Text style={styles.sectionTitle}>Items</Text>
                  {order.items.map(item => (
                    <View key={item.id} style={styles.orderItem}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
                      </View>
                      <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                {/* Shipping Info */}
                <View style={styles.shippingSection}>
                  <Text style={styles.sectionTitle}>Shipping Address</Text>
                  <Text style={styles.shippingAddress}>{order.shippingAddress}</Text>
                </View>

                {/* Order Summary */}
                <View style={styles.summarySection}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{order.total}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Free</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{order.total}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleTrackOrder(order)}
                  >
                    <MaterialIcons name="local-shipping" size={20} color="#667eea" />
                    <Text style={styles.actionButtonText}>Track Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.reorderButton]}
                    onPress={() => handleReorder(order)}
                  >
                    <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  shippingSection: {
    marginBottom: 20,
  },
  shippingAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667eea',
    flex: 1,
    marginHorizontal: 4,
  },
  reorderButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 6,
  },
});

export default OrdersScreen; 