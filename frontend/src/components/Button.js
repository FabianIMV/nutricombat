import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Button({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  variant = 'primary'
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.push(styles.primary);
          break;
        case 'secondary':
          baseStyle.push(styles.secondary);
          break;
        case 'outline':
          baseStyle.push(styles.outline);
          break;
        case 'alert':
          baseStyle.push(styles.alert);
          break;
        default:
          baseStyle.push(styles.primary);
      }
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    } else {
      switch (variant) {
        case 'outline':
          baseTextStyle.push(styles.outlineText);
          break;
        default:
          baseTextStyle.push(styles.primaryText);
      }
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  alert: {
    backgroundColor: COLORS.alert,
  },
  disabled: {
    backgroundColor: COLORS.darkGray,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.lightGray,
  },
});