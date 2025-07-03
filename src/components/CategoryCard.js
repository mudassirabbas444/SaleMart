import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CategoryCard = ({ category, onPress, isSelected = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isSelected ? ['#667eea', '#764ba2'] : ['#f8f9fa', '#e9ecef']}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={category.icon} 
            size={32} 
            color={isSelected ? '#fff' : category.color} 
          />
        </View>
        <Text style={[styles.name, isSelected && styles.selectedName]}>
          {category.name}
        </Text>
        <Text style={[styles.count, isSelected && styles.selectedCount]}>
          {category.productCount} items
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedContainer: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  gradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedName: {
    color: '#fff',
  },
  count: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedCount: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default CategoryCard; 