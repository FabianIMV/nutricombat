import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const [profileData, setProfileData] = useState({
    fullName: '',
    discipline: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    age: ''
  });
  const { user, logout } = useAuth();

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

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.name || 'Usuario'
      }));
      // TODO: Load complete profile data from Supabase
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.subtitle}>Información del peleador</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profileData.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{profileData.fullName}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{profileData.fullName || 'No especificado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Edad:</Text>
              <Text style={styles.infoValue}>{profileData.age || 'No especificado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Altura:</Text>
              <Text style={styles.infoValue}>{profileData.height ? `${profileData.height} cm` : 'No especificado'}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Deportiva</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Disciplina:</Text>
              <Text style={styles.infoValue}>{profileData.discipline || 'No especificado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso Actual:</Text>
              <Text style={styles.infoValue}>{profileData.currentWeight ? `${profileData.currentWeight} kg` : 'No especificado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso Objetivo:</Text>
              <Text style={styles.infoValue}>{profileData.targetWeight ? `${profileData.targetWeight} kg` : 'No especificado'}</Text>
            </View>
          </View>

        </View>

        {/* Sección de Configuraciones */}
        <View style={styles.configSection}>
          <Text style={styles.configTitle}>Configuración</Text>

          <TouchableOpacity style={styles.configButton} onPress={handleEditProfile}>
            <View style={styles.configButtonContent}>
              <Text style={styles.iconText}>✏️</Text>
              <Text style={styles.configButtonText}>Modificar mi perfil</Text>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.configButtonContent}>
              <Text style={styles.iconTextWhite}>🚪</Text>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  configSection: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingBottom: 5,
  },
  configButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  configButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  configButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: COLORS.error || '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
    marginRight: 12,
  },
  iconTextWhite: {
    fontSize: 18,
    marginRight: 8,
  },
  arrowText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
});