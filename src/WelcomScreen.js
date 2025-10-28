import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons'

const PRIMARY_COLOR = '#1e3a8a';
const ACCENT_COLOR = '#8DB600';
const BACKGROUND_COLOR = '#f8fafc';
const CARD_COLOR = '#ffffff';

const WelcomeScreen = ({ route, navigation }) => {
  const { first_name } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <MaterialIcons name="celebration" size={60} color={ACCENT_COLOR} />
          <Text style={styles.title}>Welcome, {first_name}!</Text>
          <Text style={styles.subtitle}>Your account has been successfully created.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')} // Replace with your Home screen
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
    width: '100%',
    backgroundColor: CARD_COLOR,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: '700', color: PRIMARY_COLOR, marginTop: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 8, textAlign: 'center' },
  button: {
    marginTop: 24,
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default WelcomeScreen;
