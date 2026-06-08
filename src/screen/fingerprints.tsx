import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics();

const fingerprints = ({ navigation }: { navigation: any }) => {

    const handleFingerprint = async () => {
        try {
            const { available } = await rnBiometrics.isSensorAvailable();

            if (!available) {
                Alert.alert('Error', 'Fingerprint not available on this device');
                return;
            }

            const result = await rnBiometrics.simplePrompt({
                promptMessage: 'Confirm Fingerprint'
            });

            console.log('Fingerprint result:', result);

            if (result.success) {

                Alert.alert('Success', 'Fingerprint verified successfully');

                await AsyncStorage.setItem("userToken", "123");

            } else {
                Alert.alert('Failed', 'Fingerprint not matched');
            }

        } catch (err) {
            console.log('Biometric error:', err);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <LinearGradient
            colors={['#00aaff1e', '#FFFFFF']}
            start={{ x: 1.3, y: 0.9 }}
            end={{ x: 0.5, y: 1.5 }}
            style={styles.mainContainer}
        >
            <Image
                style={styles.image}
                source={require('../images/notes.png')}
            />

            <Image
                style={styles.image2}
                source={require('../images/thamp.png')}
            />

            <Text style={styles.title}>Verify Your Fingerprints</Text>

            <Text style={styles.subtitle}>
                Touch sensor to verify your fingerprints
            </Text>

            <TouchableOpacity onPress={handleFingerprint}>
                <Image
                    style={styles.image3}
                    source={require('../images/thamprint.png')}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginText}>Login With Password?</Text>
            </TouchableOpacity>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    image: {
        height: 120,
        width: 120,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 60,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#001B62',
        marginTop: 20,
        textAlign: 'center',
    },

    subtitle: {
        color: '#001B62',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '200',
        marginBottom: 66,
    },

    image2: {
        height: 214,
        width: 224,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 30,
    },

    image3: {
        height: 122.71,
        width: 91.24,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 40,
    },

    loginText: {
        color: '#001B62',
        fontSize: 19,
        fontWeight: '500',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default fingerprints;