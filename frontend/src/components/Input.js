import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  labelStyle,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  secureTextEntry = false,
  error,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          inputStyle,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.darkGray}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  inputError: {
    borderColor: COLORS.alert,
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.darkGray,
  },
  errorText: {
    color: COLORS.alert,
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
});