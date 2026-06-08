import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Login = ({ navigation }: { navigation: any }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const data = await AsyncStorage.getItem('users');

            if (!data) {
                Alert.alert('Error', 'No users found. Please register first');
                return;
            }

            const users = JSON.parse(data);

            const foundUser = users.find(
                (u: any) =>
                    u.password === password
            );

            if (foundUser) {

                await AsyncStorage.setItem(
                    'currentUser',
                    JSON.stringify(foundUser)
                );

                await AsyncStorage.setItem('userToken', 'true');

                setPassword('');

                Alert.alert('Success', 'Login Successful');

            } else {
                Alert.alert('Error', 'Invalid username or password');
            }

        } catch (error) {
            console.log(error);
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

            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.activeTab}>
                    <LinearGradient
                        colors={['#2FA4FF', '#001B79']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientTab}
                    >
                        <Text style={styles.activeTabText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.inactiveTab}
                    onPress={() => navigation.replace('register')}
                >
                    <Text style={styles.inactiveTabText}>Register</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Find Your Notes</Text>

            <Text style={styles.subtitle}>
                Enter password to view your notes
            </Text>

            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#7d8aa0"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                >
                    <Image
                        source={require('../images/eyes.png')}
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.loginBtn}
                onPress={handleLogin}
            >
                <LinearGradient
                    colors={['#2FA4FF', '#001B79']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginGradient}
                >
                    <Text style={styles.loginText}>Login</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.or}>OR</Text>

            <TouchableOpacity style={styles.bioBtn}
                onPress={() => navigation.replace('fingerprints')}
            >
                <Image
                    style={styles.image2}
                    source={require('../images/Icon.png')}
                />
                <Text style={styles.bioText}>Login With Biometrics</Text>
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

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#EEF2F5',
        borderRadius: 22,
        padding: 3,
        marginTop: 30,
        marginHorizontal: 20
    },

    activeTab: {
        flex: 1,
        borderRadius: 30,
    },

    gradientTab: {
        borderRadius: 14,
        alignItems: 'center',
    },

    activeTabText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 22,
        paddingBottom: 16,
        paddingTop: 16,
    },

    inactiveTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inactiveTabText: {
        color: '#7B8BA1',
        fontSize: 22,
        fontWeight: '600',
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#001B62',
        marginTop: 35,
        marginLeft: 20,
    },

    subtitle: {
        color: '#001B62',
        marginTop: 8,
        fontSize: 16,
        marginLeft: 20,
        fontWeight: '200',
    },

    label: {
        marginTop: 35,
        marginBottom: 10,
        fontSize: 16,
        color: '#001B62',
        fontWeight: '600',
        marginLeft: 20,
    },

    inputContainer: {
        backgroundColor: '#F5F7FA',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 58,
        marginHorizontal: 22,
        shadowOpacity: 0.1
    },

    input: {
        flex: 1,
        color: '#001B62',
    },

    eye: {
        fontSize: 18,
    },

    loginBtn: {
        marginTop: 70,
        marginHorizontal: 22,
    },

    loginGradient: {
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    or: {
        textAlign: 'center',
        marginVertical: 14,
        color: '#001B62',
        fontWeight: '300',
        marginTop: 26,
        marginBottom: 26,
    },

    bioBtn: {
        backgroundColor: '#001B621A',
        height: 58,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 22,
        flexDirection: 'row',
        gap: 3,
    },

    bioText: {
        color: '#001B62',
        fontWeight: '400',
        fontSize: 18,
    },
    image2: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    eyeBtn: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    eyeIcon: {
        width: 19,
        height: 14,
        resizeMode: 'contain',
        tintColor: '#001B62',
    },
});

export default Login;