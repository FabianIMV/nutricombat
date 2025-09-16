import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/colors';
import { getCurrentUser, updateUserProfile, getUserProfile } from '../services/supabase';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const { data: profile } = await getUserProfile(currentUser.id);

        if (profile) {
          setFullName(profile.full_name || '');
          setDiscipline(profile.discipline || '');
          setCurrentWeight(profile.current_weight?.toString() || '');
          setTargetWeight(profile.target_weight?.toString() || '');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    if (!fullName || !discipline || !currentWeight || !targetWeight) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        full_name: fullName,
        email: user.email,
        discipline,
        current_weight: parseFloat(currentWeight),
        target_weight: parseFloat(targetWeight),
      };

      const { error } = await updateUserProfile(user.id, profileData);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Profile saved successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fighter Profile</Text>
      <Text style={styles.subtitle}>Set up your fighter profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={COLORS.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Discipline (MMA, Boxing, etc.)"
        placeholderTextColor={COLORS.textSecondary}
        value={discipline}
        onChangeText={setDiscipline}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Weight (kg)"
        placeholderTextColor={COLORS.textSecondary}
        value={currentWeight}
        onChangeText={setCurrentWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Target Weight (kg)"
        placeholderTextColor={COLORS.textSecondary}
        value={targetWeight}
        onChangeText={setTargetWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: COLORS.accent,
    color: COLORS.text,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});