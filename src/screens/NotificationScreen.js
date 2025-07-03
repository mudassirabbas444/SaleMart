import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped and is on its way!',
      time: '2 hours ago',
      isRead: false,
      icon: 'local-shipping',
      color: '#4CAF50',
    },
    {
      id: 2,
      type: 'promo',
      title: 'Special Offer',
      message: 'Get 20% off on all electronics! Limited time offer.',
      time: '1 day ago',
      isRead: false,
      icon: 'local-offer',
      color: '#FF9800',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of $99.99 has been processed successfully.',
      time: '2 days ago',
      isRead: true,
      icon: 'payment',
      color: '#2196F3',
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Delivery Update',
      message: 'Your package will be delivered today between 2-4 PM.',
      time: '3 days ago',
      isRead: true,
      icon: 'delivery-dining',
      color: '#9C27B0',
    },
    {
      id: 5,
      type: 'system',
      title: 'App Update',
      message: 'New version available with improved features and bug fixes.',
      time: '1 week ago',
      isRead: true,
      icon: 'system-update',
      color: '#607D8B',
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(notifications.filter(notification => notification.id !== id));
          }
        }
      ]
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
          }
        }
      ]
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => markAsRead(notification.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={notification.icon}
            size={24}
            color={notification.color}
          />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(notification.id)}
        >
          <MaterialIcons name="close" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {!notification.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="notifications" size={24} color="#667eea" />
          <Text style={styles.headerText}>Notifications</Text>
          {getUnreadCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getUnreadCount()}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={markAllAsRead}
            disabled={getUnreadCount() === 0}
          >
            <MaterialIcons name="done-all" size={20} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearAll}
            disabled={notifications.length === 0}
          >
            <MaterialIcons name="clear-all" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  badge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  notificationsList: {
    gap: 12,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
}); 