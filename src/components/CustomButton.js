import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline'
  style,
  textStyle,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'secondary':
        return ['#95a5a6', '#7f8c8d'];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.button;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {variant === 'outline' ? (
        <Text style={[getTextStyle(), textStyle]}>
          {loading ? 'Loading...' : title}
        </Text>
      ) : (
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  outlineButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton; 