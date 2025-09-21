import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    discipline: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    age: ''
  });
  const { user } = useAuth();

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

          <Text style={styles.editNote}>
            Para editar tu perfil, ve a Configuración > Modificar mi perfil
          </Text>
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
  editNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 15,
  },
});