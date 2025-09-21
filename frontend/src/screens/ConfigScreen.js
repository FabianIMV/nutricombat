import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function ConfigScreen({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      <View style={styles.optionsList}>
        <TouchableOpacity style={styles.optionButton} onPress={handleEditProfile}>
          <Text style={styles.optionText}>Modificar mi perfil</Text>
          <Text style={styles.optionArrow}>></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
  },
  optionsList: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  optionArrow: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});