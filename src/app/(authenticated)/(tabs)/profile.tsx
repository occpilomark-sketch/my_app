import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PROFILE_STORAGE_KEY = '@user_profile_data';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
const DEFAULT_BIO = 'Building cool mobile apps with Expo Router & React Native ✨';

export default function ProfileScreen() {
  const [name, setName] = useState('Your Name');
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);
  const [tempAvatar, setTempAvatar] = useState(avatar);

  // Load saved profile data when the screen mounts
  useEffect(() => {
    loadSavedProfile();
  }, []);

  const loadSavedProfile = async () => {
    try {
      const savedData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.name) setName(parsed.name);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.avatar) setAvatar(parsed.avatar);
      }
    } catch (error) {
      console.log('Failed to load profile from storage:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTempAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!tempName.trim()) {
      Alert.alert('Missing Name', 'Please enter your name before saving.');
      return;
    }

    const updatedProfile = {
      name: tempName.trim(),
      bio: tempBio.trim(),
      avatar: tempAvatar,
    };

    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      setName(updatedProfile.name);
      setBio(updatedProfile.bio);
      setAvatar(updatedProfile.avatar);
      setIsEditing(false);
      Alert.alert('Success 🎉', 'Profile saved permanently!');
    } catch (error) {
      Alert.alert('Error', 'Could not save your profile changes.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // Do NOT clear PROFILE_STORAGE_KEY here so your pic and bio stay saved!
          router.replace('/(unauthenticated)/login');
        },
      },
    ]);
  };

  if (loadingProfile) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.topBar}>
          <View style={styles.badgeContainer}>
            <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
            <Text style={styles.badgeText}>Verified Member</Text>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>
          @{name.toLowerCase().replace(/\s+/g, '') || 'yourusername'}
        </Text>
        <Text style={styles.bio}>{bio}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>348</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>182</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setTempName(name);
              setTempBio(bio);
              setTempAvatar(avatar);
              setIsEditing(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity style={styles.modalAvatarContainer} onPress={pickProfileImage} activeOpacity={0.8}>
              <Image source={{ uri: tempAvatar }} style={styles.modalAvatar} />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.helperText}>Tap image to choose from gallery</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput style={styles.textInput} value={tempName} onChangeText={setTempName} />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, { height: 80, paddingTop: 10 }]}
              value={tempBio}
              onChangeText={setTempBio}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelModalButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  container: { flexGrow: 1, backgroundColor: '#F3F4F6', padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  topBar: { width: '100%', alignItems: 'flex-end', marginBottom: 10 },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#3B82F6' },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#E5E7EB' },
  name: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 2 },
  handle: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  bio: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  statDivider: { width: 1, height: 24, backgroundColor: '#E5E7EB' },
  actionContainer: { width: '100%', gap: 12 },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  modalAvatarContainer: { position: 'relative', marginBottom: 6 },
  modalAvatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#3B82F6' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  helperText: { fontSize: 12, color: '#6B7280', marginBottom: 16 },
  inputLabel: { alignSelf: 'flex-start', fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
    fontSize: 15,
    color: '#1F2937',
  },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 10 },
  cancelModalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  saveModalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#3B82F6', alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '600' },
});