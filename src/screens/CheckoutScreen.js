import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton';

const CheckoutScreen = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'John Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
  });

  const cartItems = route.params?.cartItems || [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
      id: 3,
      name: "Premium Coffee Maker",
      price: 149.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      icon: 'account-balance-wallet',
      description: 'Pay with your PayPal account',
    },
    {
      id: 'apple',
      title: 'Apple Pay',
      icon: 'phone-iphone',
      description: 'Quick and secure payment',
    },
  ];

  const handlePlaceOrder = () => {
    Alert.alert(
      'Confirm Order',
      `Total: $${total.toFixed(2)}\n\nPlace your order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Place Order', 
          onPress: () => {
            Alert.alert(
              'Order Placed!',
              'Your order has been successfully placed. You will receive a confirmation email shortly.',
              [
                { 
                  text: 'View Orders', 
                  onPress: () => navigation.navigate('Orders')
                },
                { 
                  text: 'Continue Shopping', 
                  onPress: () => navigation.navigate('Home')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleEditAddress = () => {
    Alert.alert(
      'Edit Address',
      'Address editing functionality would be implemented here.',
      [{ text: 'OK' }]
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
        <Text style={styles.title}>Checkout</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-on" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <TouchableOpacity onPress={handleEditAddress}>
              <MaterialIcons name="edit" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{shippingAddress.fullName}</Text>
            <Text style={styles.addressText}>{shippingAddress.address}</Text>
            <Text style={styles.addressText}>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </Text>
            <Text style={styles.addressPhone}>{shippingAddress.phone}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="payment" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPaymentMethod === method.id && styles.selectedPaymentCard
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentInfo}>
                <MaterialIcons 
                  name={method.icon} 
                  size={24} 
                  color={selectedPaymentMethod === method.id ? "#667eea" : "#666"} 
                />
                <View style={styles.paymentDetails}>
                  <Text style={[
                    styles.paymentTitle,
                    selectedPaymentMethod === method.id && styles.selectedPaymentTitle
                  ]}>
                    {method.title}
                  </Text>
                  <Text style={styles.paymentDescription}>{method.description}</Text>
                </View>
              </View>
              {selectedPaymentMethod === method.id && (
                <MaterialIcons name="check-circle" size={24} color="#667eea" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shopping-cart" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
          {cartItems.map(item => (
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

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="receipt" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <CustomButton
          title="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        />
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
  backButton: {
    marginBottom: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 4,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedPaymentCard: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedPaymentTitle: {
    color: '#667eea',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    paddingTop: 12,
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
  bottomAction: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  placeOrderButton: {
    width: '100%',
  },
});

export default CheckoutScreen; 