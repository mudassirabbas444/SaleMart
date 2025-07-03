import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';

export default function HelpSupportScreen({ navigation }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit cards, debit cards, and digital wallets.',
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging intact. Some items may have different return conditions.',
    },
    {
      id: 3,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee. International shipping times vary by location.',
    },
    {
      id: 4,
      question: 'Can I track my order?',
      answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order in the "My Orders" section of the app.',
    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and various digital wallets including Apple Pay and Google Pay.',
    },
    {
      id: 6,
      question: 'How do I change or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. Contact our customer service team immediately for assistance.',
    },
  ];

  const contactOptions = [
    {
      id: 1,
      title: 'Customer Service',
      subtitle: 'Get help with orders and general inquiries',
      icon: 'support-agent',
      color: '#667eea',
      action: () => Linking.openURL('tel:+1234567890'),
    },
    {
      id: 2,
      title: 'Email Support',
      subtitle: 'Send us an email for detailed assistance',
      icon: 'email',
      color: '#4CAF50',
      action: () => Linking.openURL('mailto:support@example.com'),
    },
    {
      id: 3,
      title: 'Live Chat',
      subtitle: 'Chat with our support team in real-time',
      icon: 'chat',
      color: '#FF9800',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
    {
      id: 4,
      title: 'Social Media',
      subtitle: 'Follow us for updates and support',
      icon: 'share',
      color: '#9C27B0',
      action: () => Alert.alert('Social Media', 'Connect with us on Facebook, Twitter, and Instagram!'),
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const FAQItem = ({ item }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFaq(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <MaterialIcons
          name={expandedFaq === item.id ? 'expand-less' : 'expand-more'}
          size={24}
          color="#667eea"
        />
      </TouchableOpacity>
      {expandedFaq === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  const ContactOption = ({ option }) => (
    <TouchableOpacity
      style={styles.contactOption}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIcon, { backgroundColor: option.color + '20' }]}>
        <MaterialIcons name={option.icon} size={24} color={option.color} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="help" size={24} color="#667eea" />
        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="receipt" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="swap-horiz" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Return Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="payment" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Payment Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactOptions}>
          {contactOptions.map((option) => (
            <ContactOption key={option.id} option={option} />
          ))}
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {faqData.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </View>
      </View>

      {/* Additional Help */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Resources</Text>
        <View style={styles.resources}>
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="description" size={20} color="#667eea" />
            <Text style={styles.resourceText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="security" size={20} color="#667eea" />
            <Text style={styles.resourceText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="shipping" size={20} color="#667eea" />
            <Text style={styles.resourceText}>Shipping Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Send Feedback"
          variant="outline"
          onPress={() => Alert.alert('Feedback', 'Thank you for your feedback!')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  section: {
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  contactOptions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  faqList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#f8f9fa',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resources: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resourceText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    marginTop: 20,
  },
}); 