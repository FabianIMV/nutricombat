import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Platform, Modal, FlatList, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../styles/colors';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePicture, deleteProfilePicture } from '../services/supabase';

const activityOptions = [
  { label: 'Sedentario', value: 'Sedentario' },
  { label: 'Moderado', value: 'Moderado' },
  { label: 'Activo', value: 'Activo' },
  { label: 'Muy Activo', value: 'Muy Activo' }
];

const goalsOptions = [
  { label: 'Perdida de peso', value: 'Perdida de peso' },
  { label: 'Ganancia muscular', value: 'Ganancia muscular' },
  { label: 'Mantener peso', value: 'Mantener peso' },
  { label: 'Corte de peso', value: 'Corte de peso' },
  { label: 'Rendimiento', value: 'Rendimiento' }
];

const IOSSelector = ({ options, selectedValue, onSelect, placeholder, modalVisible, setModalVisible }) => {
  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <>
      <TouchableOpacity
        style={styles.iosSelectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.iosSelectorText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.iosSelectorArrow}>v</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar opcion</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === selectedValue && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === selectedValue && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [oldProfilePictureUrl, setOldProfilePictureUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (user && user.email) {
      try {
        const response = await fetch('https://3f8q0vhfcf.execute-api.us-east-1.amazonaws.com/dev/profile?email=' + user.email);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            const profile = data.data[0];
            setName(profile.name || '');
            setWeight(profile.weight ? profile.weight.toString() : '');
            setHeight(profile.height ? profile.height.toString() : '');
            setAge(profile.age ? profile.age.toString() : '');
            setActivityLevel(profile.activity_level || '');
            setGoals(profile.goals || '');
            setProfilePictureUrl(profile.profile_picture_url || '');
            setOldProfilePictureUrl(profile.profile_picture_url || '');
          } else {
            setName(user.name || '');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setName(user.name || '');
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Necesitas permitir acceso a la galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploadingImage(true);
      try {
        // Si habia una foto antigua, eliminarla
        if (oldProfilePictureUrl) {
          await deleteProfilePicture(oldProfilePictureUrl);
        }

        // Subir la nueva foto
        const { publicUrl, error } = await uploadProfilePicture(user.email, result.assets[0].uri);

        if (error) {
          console.error('Error detallado al subir:', error);
          Alert.alert('Error', `No se pudo subir la imagen: ${error.message || JSON.stringify(error)}`);
        } else {
          setProfilePictureUrl(publicUrl);
          Alert.alert('Exito', 'Foto de perfil actualizada');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', `Ocurrio un error: ${error.message || error.toString()}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeProfilePicture = async () => {
    Alert.alert(
      'Eliminar foto',
      '¿Estas seguro de eliminar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setUploadingImage(true);
            try {
              if (profilePictureUrl) {
                await deleteProfilePicture(profilePictureUrl);
              }
              setProfilePictureUrl('');
              setOldProfilePictureUrl('');
              Alert.alert('Exito', 'Foto de perfil eliminada');
            } catch (error) {
              console.error('Error removing image:', error);
              Alert.alert('Error', 'No se pudo eliminar la imagen');
            } finally {
              setUploadingImage(false);
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    if (!name || !weight || !height || !age) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        email: user.email,
        name,
        weight: parseFloat(weight),
        height: parseInt(height),
        age: parseInt(age),
        activity_level: activityLevel,
        goals,
        profile_picture_url: profilePictureUrl
      };

      const response = await fetch('https://3f8q0vhfcf.execute-api.us-east-1.amazonaws.com/dev/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        Alert.alert('Exito', 'Perfil guardado exitosamente');
        setOldProfilePictureUrl(profilePictureUrl);
      } else {
        console.error('Error saving profile:', response.status);
        Alert.alert('Error', 'Error al guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Ocurrio un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Modificar Perfil</Text>
            <Text style={styles.subtitle}>Actualiza tu informacion personal</Text>

      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}

        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity
            style={[styles.imageButton, uploadingImage && styles.disabledButton]}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <Text style={styles.imageButtonText}>
                {profilePictureUrl ? 'Cambiar foto' : 'Subir foto'}
              </Text>
            )}
          </TouchableOpacity>

          {profilePictureUrl && (
            <TouchableOpacity
              style={[styles.removeButton, uploadingImage && styles.disabledButton]}
              onPress={removeProfilePicture}
              disabled={uploadingImage}
            >
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nombre completo"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Peso Actual</Text>
        <TextInput
          style={styles.input}
          placeholder="Peso en kilogramos"
          placeholderTextColor={COLORS.textSecondary}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Altura</Text>
        <TextInput
          style={styles.input}
          placeholder="Altura en centimetros"
          placeholderTextColor={COLORS.textSecondary}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu edad actual"
          placeholderTextColor={COLORS.textSecondary}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      {/* Activity Level Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Nivel de Actividad</Text>
        {Platform.OS === 'ios' ? (
          <IOSSelector
            options={activityOptions}
            selectedValue={activityLevel}
            onSelect={setActivityLevel}
            placeholder="Seleccionar nivel de actividad"
            modalVisible={showActivityModal}
            setModalVisible={setShowActivityModal}
          />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={activityLevel}
              style={styles.picker}
              onValueChange={setActivityLevel}
              dropdownIconColor={COLORS.secondary}
            >
              <Picker.Item label="Seleccionar nivel" value="" />
              <Picker.Item label="Sedentario" value="Sedentario" />
              <Picker.Item label="Moderado" value="Moderado" />
              <Picker.Item label="Activo" value="Activo" />
              <Picker.Item label="Muy Activo" value="Muy Activo" />
            </Picker>
          </View>
        )}
      </View>

      {/* Goals Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Objetivos</Text>
        {Platform.OS === 'ios' ? (
          <IOSSelector
            options={goalsOptions}
            selectedValue={goals}
            onSelect={setGoals}
            placeholder="Seleccionar objetivo"
            modalVisible={showGoalsModal}
            setModalVisible={setShowGoalsModal}
          />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={goals}
              style={styles.picker}
              onValueChange={setGoals}
              dropdownIconColor={COLORS.secondary}
            >
              <Picker.Item label="Seleccionar objetivo" value="" />
              <Picker.Item label="Perdida de peso" value="Perdida de peso" />
              <Picker.Item label="Ganancia muscular" value="Ganancia muscular" />
              <Picker.Item label="Mantener peso" value="Mantener peso" />
              <Picker.Item label="Corte de peso" value="Corte de peso" />
              <Picker.Item label="Rendimiento" value="Rendimiento" />
            </Picker>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Perfil</Text>
        )}
      </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  innerContainer: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  selectorContainer: {
    marginBottom: 15,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  picker: {
    color: COLORS.text,
    height: 50,
  },
  iosSelectorButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iosSelectorText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },
  iosSelectorArrow: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: COLORS.primary,
  },
  selectedOption: {
    backgroundColor: COLORS.secondary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  imageButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: COLORS.error || '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});